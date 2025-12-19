"""
Enterprise-grade caching layer using Redis
Implements distributed caching for chart calculations, predictions, and API responses
"""
from typing import Optional, Any, Dict
import json
import pickle
from datetime import timedelta
from functools import wraps
import hashlib
import logging

from app.core.redis_client import redis_client

logger = logging.getLogger(__name__)


class CacheManager:
    """
    Advanced cache manager with multiple strategies and TTL management
    """
    
    def __init__(self):
        self.redis = redis_client
        self.default_ttl = 3600  # 1 hour
        self.prefix = "astro:"
    
    def _generate_key(self, namespace: str, *args, **kwargs) -> str:
        """Generate unique cache key from namespace and parameters"""
        # Combine args and kwargs into a hashable string
        cache_data = {
            "args": args,
            "kwargs": sorted(kwargs.items())
        }
        data_str = json.dumps(cache_data, sort_keys=True, default=str)
        hash_key = hashlib.md5(data_str.encode()).hexdigest()
        return f"{self.prefix}{namespace}:{hash_key}"
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = await self.redis.get(key)
            if value:
                # Try to deserialize as JSON first
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    # Fall back to pickle for complex objects
                    try:
                        return pickle.loads(value)
                    except Exception:
                        return value
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None,
        serialize_json: bool = True
    ) -> bool:
        """Set value in cache with optional TTL"""
        try:
            if ttl is None:
                ttl = self.default_ttl
            
            # Serialize value
            if serialize_json:
                try:
                    serialized = json.dumps(value, default=str)
                except (TypeError, ValueError):
                    # Fall back to pickle for non-JSON-serializable objects
                    serialized = pickle.dumps(value)
            else:
                serialized = pickle.dumps(value)
            
            await self.redis.setex(key, ttl, serialized)
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        try:
            keys = await self.redis.keys(f"{self.prefix}{pattern}")
            if keys:
                deleted = await self.redis.delete(*keys)
                return deleted
            return 0
        except Exception as e:
            logger.error(f"Cache delete pattern error for {pattern}: {e}")
            return 0
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            return await self.redis.exists(key)
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {e}")
            return False
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter in cache"""
        try:
            return await self.redis.incrby(key, amount)
        except Exception as e:
            logger.error(f"Cache increment error for key {key}: {e}")
            return 0
    
    async def get_or_set(
        self, 
        key: str, 
        factory, 
        ttl: Optional[int] = None
    ) -> Any:
        """Get from cache or compute and set if not exists"""
        value = await self.get(key)
        if value is not None:
            return value
        
        # Compute value
        if callable(factory):
            value = factory() if not hasattr(factory, '__await__') else await factory()
        else:
            value = factory
        
        # Cache the computed value
        await self.set(key, value, ttl)
        return value


# Global cache manager instance
cache_manager = CacheManager()


def cached(
    namespace: str,
    ttl: Optional[int] = None,
    key_builder = None
):
    """
    Decorator for caching function results
    
    Usage:
        @cached("chart_calculations", ttl=3600)
        async def calculate_chart(date, lat, lon):
            # expensive calculation
            return chart_data
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                cache_key = cache_manager._generate_key(namespace, *args, **kwargs)
            
            # Try to get from cache
            cached_value = await cache_manager.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_value
            
            # Execute function
            logger.debug(f"Cache miss for {cache_key}")
            result = await func(*args, **kwargs) if hasattr(func, '__await__') else func(*args, **kwargs)
            
            # Cache result
            await cache_manager.set(cache_key, result, ttl)
            
            return result
        
        return wrapper
    return decorator


class ChartCache:
    """Specialized cache for birth chart calculations"""
    
    @staticmethod
    async def get_chart(
        birth_datetime: str,
        latitude: float,
        longitude: float,
        chart_type: str
    ) -> Optional[Dict]:
        """Get cached chart"""
        key = cache_manager._generate_key(
            "chart",
            birth_datetime=birth_datetime,
            lat=latitude,
            lon=longitude,
            type=chart_type
        )
        return await cache_manager.get(key)
    
    @staticmethod
    async def set_chart(
        birth_datetime: str,
        latitude: float,
        longitude: float,
        chart_type: str,
        chart_data: Dict,
        ttl: int = 86400  # 24 hours
    ) -> bool:
        """Cache chart with 24-hour TTL"""
        key = cache_manager._generate_key(
            "chart",
            birth_datetime=birth_datetime,
            lat=latitude,
            lon=longitude,
            type=chart_type
        )
        return await cache_manager.set(key, chart_data, ttl)
    
    @staticmethod
    async def invalidate_user_charts(user_id: int) -> int:
        """Invalidate all cached charts for a user"""
        return await cache_manager.delete_pattern(f"chart:*user_{user_id}*")


class PredictionCache:
    """Specialized cache for AI predictions"""
    
    @staticmethod
    async def get_prediction(
        chart_hash: str,
        question: str
    ) -> Optional[Dict]:
        """Get cached prediction"""
        key = cache_manager._generate_key(
            "prediction",
            chart=chart_hash,
            question=question
        )
        return await cache_manager.get(key)
    
    @staticmethod
    async def set_prediction(
        chart_hash: str,
        question: str,
        prediction_data: Dict,
        ttl: int = 3600  # 1 hour
    ) -> bool:
        """Cache prediction"""
        key = cache_manager._generate_key(
            "prediction",
            chart=chart_hash,
            question=question
        )
        return await cache_manager.set(key, prediction_data, ttl)


class RateLimitCache:
    """Cache-based rate limiting"""
    
    @staticmethod
    async def check_rate_limit(
        user_id: int,
        endpoint: str,
        limit: int = 100,
        window: int = 3600  # 1 hour
    ) -> tuple[bool, int, int]:
        """
        Check if user has exceeded rate limit
        Returns: (allowed, current_count, remaining)
        """
        key = f"{cache_manager.prefix}ratelimit:{user_id}:{endpoint}"
        
        try:
            current = await cache_manager.redis.get(key)
            current_count = int(current) if current else 0
            
            if current_count >= limit:
                ttl = await cache_manager.redis.ttl(key)
                return False, current_count, 0
            
            # Increment counter
            new_count = await cache_manager.redis.incr(key)
            
            # Set expiry on first request
            if new_count == 1:
                await cache_manager.redis.expire(key, window)
            
            remaining = max(0, limit - new_count)
            return True, new_count, remaining
            
        except Exception as e:
            logger.error(f"Rate limit check error: {e}")
            # Allow request on cache failure
            return True, 0, limit


class SessionCache:
    """Cache for user sessions and temporary data"""
    
    @staticmethod
    async def store_session(
        session_id: str,
        data: Dict,
        ttl: int = 86400  # 24 hours
    ) -> bool:
        """Store session data"""
        key = f"{cache_manager.prefix}session:{session_id}"
        return await cache_manager.set(key, data, ttl)
    
    @staticmethod
    async def get_session(session_id: str) -> Optional[Dict]:
        """Get session data"""
        key = f"{cache_manager.prefix}session:{session_id}"
        return await cache_manager.get(key)
    
    @staticmethod
    async def delete_session(session_id: str) -> bool:
        """Delete session"""
        key = f"{cache_manager.prefix}session:{session_id}"
        return await cache_manager.delete(key)
    
    @staticmethod
    async def refresh_session(session_id: str, ttl: int = 86400) -> bool:
        """Refresh session TTL"""
        key = f"{cache_manager.prefix}session:{session_id}"
        try:
            await cache_manager.redis.expire(key, ttl)
            return True
        except Exception as e:
            logger.error(f"Session refresh error: {e}")
            return False
