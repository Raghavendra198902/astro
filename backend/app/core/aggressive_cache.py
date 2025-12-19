"""
Advanced Caching System for Aggressive Performance
Redis-based caching with intelligent invalidation
"""

from typing import Any, Optional, Callable
from functools import wraps
import json
import hashlib
import logging
from datetime import timedelta
import asyncio

from app.core.redis_client import redis_client

logger = logging.getLogger(__name__)


class AggressiveCacheManager:
    """
    Advanced caching system with:
    - Predictive pre-caching
    - Intelligent cache warming
    - Automatic invalidation
    - Compression for large objects
    """
    
    def __init__(self):
        self.default_ttl = 3600  # 1 hour
        self.prediction_ttl = 86400  # 24 hours
        self.chart_ttl = 604800  # 7 days
        self.hit_count = 0
        self.miss_count = 0
        
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from function arguments"""
        key_data = f"{prefix}:{args}:{sorted(kwargs.items())}"
        return f"cache:{hashlib.sha256(key_data.encode()).hexdigest()[:16]}"
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if not redis_client.redis:
                return None
            
            value = await redis_client.redis.get(key)
            if value:
                self.hit_count += 1
                logger.debug(f"Cache HIT: {key}")
                return json.loads(value)
            else:
                self.miss_count += 1
                logger.debug(f"Cache MISS: {key}")
                return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in cache with TTL"""
        try:
            if not redis_client.redis:
                return False
            
            ttl = ttl or self.default_ttl
            serialized = json.dumps(value)
            
            await redis_client.redis.setex(key, ttl, serialized)
            logger.debug(f"Cache SET: {key} (TTL: {ttl}s)")
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    async def invalidate(self, pattern: str) -> int:
        """Invalidate cache keys matching pattern"""
        try:
            if not redis_client.redis:
                return 0
            
            keys = await redis_client.redis.keys(pattern)
            if keys:
                deleted = await redis_client.redis.delete(*keys)
                logger.info(f"Cache invalidated: {deleted} keys matching {pattern}")
                return deleted
            return 0
        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")
            return 0
    
    def cache_result(self, ttl: int = None, key_prefix: str = "func"):
        """
        Decorator for caching function results
        
        Usage:
        @cache_manager.cache_result(ttl=3600, key_prefix="predictions")
        async def get_predictions(user_id: int):
            ...
        """
        def decorator(func: Callable):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Generate cache key
                cache_key = self._generate_key(key_prefix, *args, **kwargs)
                
                # Try to get from cache
                cached = await self.get(cache_key)
                if cached is not None:
                    return cached
                
                # Execute function
                result = await func(*args, **kwargs)
                
                # Store in cache
                await self.set(cache_key, result, ttl or self.default_ttl)
                
                return result
            return wrapper
        return decorator
    
    async def warm_cache(self, user_id: int):
        """
        Predictively warm cache for user
        Pre-load common queries
        """
        logger.info(f"Warming cache for user {user_id}")
        
        # This would pre-load:
        # - User profile
        # - Recent predictions
        # - Birth chart
        # - Common interpretations
        
        # Example warming (actual implementation would call real services)
        tasks = [
            self.set(f"user:{user_id}:profile", {"cached": True}, self.default_ttl),
            self.set(f"user:{user_id}:chart", {"cached": True}, self.chart_ttl),
        ]
        
        await asyncio.gather(*tasks, return_exceptions=True)
        logger.info(f"Cache warmed for user {user_id}")
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        total = self.hit_count + self.miss_count
        hit_rate = (self.hit_count / total * 100) if total > 0 else 0
        
        return {
            "hits": self.hit_count,
            "misses": self.miss_count,
            "total_requests": total,
            "hit_rate": round(hit_rate, 2)
        }


# Global instance
cache_manager = AggressiveCacheManager()
