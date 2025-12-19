"""
Enterprise Rate Limiting and Quota Management
Multi-tier rate limiting with Redis backend
"""
from typing import Optional, Dict, Tuple
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
import logging

from app.core.redis_client import redis_client
from app.core.cache import RateLimitCache

logger = logging.getLogger(__name__)


class RateLimitTier:
    """Define rate limit tiers for different user types"""
    
    FREE = {
        "name": "free",
        "requests_per_minute": 10,
        "requests_per_hour": 100,
        "requests_per_day": 500,
        "concurrent_requests": 2,
        "burst_allowance": 20,
    }
    
    BASIC = {
        "name": "basic",
        "requests_per_minute": 30,
        "requests_per_hour": 500,
        "requests_per_day": 2000,
        "concurrent_requests": 5,
        "burst_allowance": 50,
    }
    
    PREMIUM = {
        "name": "premium",
        "requests_per_minute": 100,
        "requests_per_hour": 2000,
        "requests_per_day": 10000,
        "concurrent_requests": 10,
        "burst_allowance": 150,
    }
    
    ENTERPRISE = {
        "name": "enterprise",
        "requests_per_minute": 500,
        "requests_per_hour": 10000,
        "requests_per_day": 100000,
        "concurrent_requests": 50,
        "burst_allowance": 1000,
    }
    
    @classmethod
    def get_tier(cls, tier_name: str) -> Dict:
        """Get rate limit configuration for a tier"""
        tiers = {
            "free": cls.FREE,
            "basic": cls.BASIC,
            "premium": cls.PREMIUM,
            "enterprise": cls.ENTERPRISE,
        }
        return tiers.get(tier_name.lower(), cls.FREE)


class AdvancedRateLimiter:
    """
    Advanced rate limiter with multiple window sizes,
    burst protection, and quota management
    """
    
    def __init__(self):
        self.redis = redis_client
        self.prefix = "ratelimit:"
    
    async def check_rate_limit(
        self,
        identifier: str,
        tier: Dict,
        endpoint: str
    ) -> Tuple[bool, Dict]:
        """
        Check if request is within rate limits
        
        Returns: (allowed, info_dict)
        """
        now = datetime.utcnow()
        
        # Check minute limit
        minute_key = f"{self.prefix}{identifier}:minute:{now.strftime('%Y%m%d%H%M')}"
        minute_count = await self._increment_counter(minute_key, 60)
        
        if minute_count > tier["requests_per_minute"]:
            return False, {
                "error": "Rate limit exceeded",
                "limit_type": "per_minute",
                "limit": tier["requests_per_minute"],
                "current": minute_count,
                "retry_after": 60 - now.second
            }
        
        # Check hour limit
        hour_key = f"{self.prefix}{identifier}:hour:{now.strftime('%Y%m%d%H')}"
        hour_count = await self._increment_counter(hour_key, 3600)
        
        if hour_count > tier["requests_per_hour"]:
            retry_after = 3600 - (now.minute * 60 + now.second)
            return False, {
                "error": "Rate limit exceeded",
                "limit_type": "per_hour",
                "limit": tier["requests_per_hour"],
                "current": hour_count,
                "retry_after": retry_after
            }
        
        # Check day limit
        day_key = f"{self.prefix}{identifier}:day:{now.strftime('%Y%m%d')}"
        day_count = await self._increment_counter(day_key, 86400)
        
        if day_count > tier["requests_per_day"]:
            retry_after = 86400 - (now.hour * 3600 + now.minute * 60 + now.second)
            return False, {
                "error": "Daily quota exceeded",
                "limit_type": "per_day",
                "limit": tier["requests_per_day"],
                "current": day_count,
                "retry_after": retry_after
            }
        
        # Check concurrent requests
        concurrent_key = f"{self.prefix}{identifier}:concurrent"
        concurrent_count = await self.redis.get(concurrent_key)
        concurrent = int(concurrent_count) if concurrent_count else 0
        
        if concurrent >= tier["concurrent_requests"]:
            return False, {
                "error": "Too many concurrent requests",
                "limit_type": "concurrent",
                "limit": tier["concurrent_requests"],
                "current": concurrent,
                "retry_after": 5
            }
        
        # All checks passed
        return True, {
            "allowed": True,
            "tier": tier["name"],
            "remaining": {
                "per_minute": tier["requests_per_minute"] - minute_count,
                "per_hour": tier["requests_per_hour"] - hour_count,
                "per_day": tier["requests_per_day"] - day_count,
            }
        }
    
    async def _increment_counter(self, key: str, ttl: int) -> int:
        """Increment a counter with automatic expiry"""
        try:
            count = await self.redis.incr(key)
            if count == 1:
                await self.redis.expire(key, ttl)
            return count
        except Exception as e:
            logger.error(f"Rate limit increment error: {e}")
            return 0
    
    async def increment_concurrent(self, identifier: str):
        """Increment concurrent request counter"""
        key = f"{self.prefix}{identifier}:concurrent"
        await self.redis.incr(key)
        await self.redis.expire(key, 60)  # Auto-cleanup after 60s
    
    async def decrement_concurrent(self, identifier: str):
        """Decrement concurrent request counter"""
        key = f"{self.prefix}{identifier}:concurrent"
        await self.redis.decr(key)
    
    async def get_usage_stats(self, identifier: str) -> Dict:
        """Get current usage statistics"""
        now = datetime.utcnow()
        
        minute_key = f"{self.prefix}{identifier}:minute:{now.strftime('%Y%m%d%H%M')}"
        hour_key = f"{self.prefix}{identifier}:hour:{now.strftime('%Y%m%d%H')}"
        day_key = f"{self.prefix}{identifier}:day:{now.strftime('%Y%m%d')}"
        concurrent_key = f"{self.prefix}{identifier}:concurrent"
        
        minute_count = await self.redis.get(minute_key)
        hour_count = await self.redis.get(hour_key)
        day_count = await self.redis.get(day_key)
        concurrent_count = await self.redis.get(concurrent_key)
        
        return {
            "current_minute": int(minute_count) if minute_count else 0,
            "current_hour": int(hour_count) if hour_count else 0,
            "current_day": int(day_count) if day_count else 0,
            "concurrent": int(concurrent_count) if concurrent_count else 0,
        }


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware for automatic rate limiting on all requests
    """
    
    def __init__(self, app):
        super().__init__(app)
        self.rate_limiter = AdvancedRateLimiter()
        
        # Endpoints exempt from rate limiting
        self.exempt_paths = [
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/health",
        ]
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for exempt paths
        if any(request.url.path.startswith(path) for path in self.exempt_paths):
            return await call_next(request)
        
        # Get user identifier (IP or user_id)
        identifier = request.client.host
        tier = RateLimitTier.FREE
        
        # Check if user is authenticated and get their tier
        if hasattr(request.state, "user"):
            user = request.state.user
            identifier = f"user_{user.id}"
            
            # Get user's subscription tier
            if hasattr(user, "subscription_tier"):
                tier = RateLimitTier.get_tier(user.subscription_tier)
        
        # Check rate limit
        allowed, info = await self.rate_limiter.check_rate_limit(
            identifier, tier, request.url.path
        )
        
        if not allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content=info,
                headers={
                    "Retry-After": str(info.get("retry_after", 60)),
                    "X-RateLimit-Limit": str(info.get("limit", 0)),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(info.get("retry_after", 60)),
                }
            )
        
        # Increment concurrent counter
        await self.rate_limiter.increment_concurrent(identifier)
        
        try:
            # Process request
            response = await call_next(request)
            
            # Add rate limit headers
            response.headers["X-RateLimit-Tier"] = tier["name"]
            response.headers["X-RateLimit-Remaining-Minute"] = str(
                info["remaining"]["per_minute"]
            )
            response.headers["X-RateLimit-Remaining-Hour"] = str(
                info["remaining"]["per_hour"]
            )
            response.headers["X-RateLimit-Remaining-Day"] = str(
                info["remaining"]["per_day"]
            )
            
            return response
            
        finally:
            # Decrement concurrent counter
            await self.rate_limiter.decrement_concurrent(identifier)


# Global rate limiter instance
rate_limiter = AdvancedRateLimiter()
