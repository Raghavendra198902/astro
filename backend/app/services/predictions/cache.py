"""
Redis Caching Service for Predictions
Provides caching layer for expensive prediction computations
"""

from typing import Optional, Dict, Any
import json
import logging
from datetime import timedelta

logger = logging.getLogger(__name__)


class PredictionCache:
    """
    Redis-based caching for life events predictions
    """
    
    def __init__(self, redis_client=None, ttl: int = 3600):
        """
        Initialize cache with Redis client
        
        Args:
            redis_client: Redis client instance (from app.core.redis_client)
            ttl: Time-to-live in seconds (default: 1 hour)
        """
        self.redis_client = redis_client
        self.ttl = ttl
        self.enabled = redis_client is not None
        
        if not self.enabled:
            logger.warning("Redis client not provided, caching disabled")
    
    async def get(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve prediction from cache
        
        Args:
            cache_key: Unique cache key
            
        Returns:
            Cached prediction data or None if not found
        """
        if not self.enabled:
            return None
        
        try:
            cached_data = await self.redis_client.get(cache_key)
            
            if cached_data:
                logger.info(f"Cache HIT for key: {cache_key[:16]}...")
                return json.loads(cached_data)
            
            logger.debug(f"Cache MISS for key: {cache_key[:16]}...")
            return None
            
        except Exception as e:
            logger.error(f"Cache retrieval error: {e}")
            return None
    
    async def set(
        self,
        cache_key: str,
        data: Dict[str, Any],
        ttl: Optional[int] = None
    ) -> bool:
        """
        Store prediction in cache
        
        Args:
            cache_key: Unique cache key
            data: Prediction data to cache
            ttl: Optional TTL override (seconds)
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            cache_ttl = ttl or self.ttl
            serialized_data = json.dumps(data)
            
            await self.redis_client.setex(
                cache_key,
                cache_ttl,
                serialized_data
            )
            
            logger.info(f"Cached prediction with key: {cache_key[:16]}... (TTL: {cache_ttl}s)")
            return True
            
        except Exception as e:
            logger.error(f"Cache storage error: {e}")
            return False
    
    async def delete(self, cache_key: str) -> bool:
        """
        Delete cached prediction
        
        Args:
            cache_key: Cache key to delete
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            await self.redis_client.delete(cache_key)
            logger.info(f"Deleted cache key: {cache_key[:16]}...")
            return True
            
        except Exception as e:
            logger.error(f"Cache deletion error: {e}")
            return False
    
    async def clear_user_cache(self, user_id: str) -> int:
        """
        Clear all cached predictions for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            Number of keys deleted
        """
        if not self.enabled:
            return 0
        
        try:
            pattern = f"prediction:*{user_id}*"
            keys = await self.redis_client.keys(pattern)
            
            if keys:
                deleted = await self.redis_client.delete(*keys)
                logger.info(f"Cleared {deleted} cache entries for user: {user_id}")
                return deleted
            
            return 0
            
        except Exception as e:
            logger.error(f"Cache clearing error: {e}")
            return 0
    
    async def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics
        
        Returns:
            Dict with cache stats (hits, misses, size, etc.)
        """
        if not self.enabled:
            return {"enabled": False}
        
        try:
            info = await self.redis_client.info("stats")
            
            return {
                "enabled": True,
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "hit_rate": self._calculate_hit_rate(info),
                "used_memory_human": info.get("used_memory_human", "N/A"),
                "total_keys": await self._count_prediction_keys()
            }
            
        except Exception as e:
            logger.error(f"Error fetching cache stats: {e}")
            return {"enabled": True, "error": str(e)}
    
    def _calculate_hit_rate(self, info: Dict) -> float:
        """Calculate cache hit rate percentage"""
        hits = info.get("keyspace_hits", 0)
        misses = info.get("keyspace_misses", 0)
        total = hits + misses
        
        if total == 0:
            return 0.0
        
        return round((hits / total) * 100, 2)
    
    async def _count_prediction_keys(self) -> int:
        """Count total prediction cache keys"""
        try:
            keys = await self.redis_client.keys("prediction:*")
            return len(keys) if keys else 0
        except:
            return 0


# Global cache instance (initialized in app startup)
_cache_instance: Optional[PredictionCache] = None


def init_prediction_cache(redis_client, ttl: int = 3600) -> PredictionCache:
    """
    Initialize global prediction cache instance
    
    Args:
        redis_client: Redis client from app.core.redis_client
        ttl: Cache TTL in seconds
        
    Returns:
        Initialized PredictionCache instance
    """
    global _cache_instance
    _cache_instance = PredictionCache(redis_client, ttl)
    logger.info(f"Prediction cache initialized (TTL: {ttl}s)")
    return _cache_instance


def get_prediction_cache() -> PredictionCache:
    """
    Get global prediction cache instance
    
    Returns:
        PredictionCache instance or raises error if not initialized
    """
    if _cache_instance is None:
        logger.warning("Cache not initialized, creating disabled instance")
        return PredictionCache(None)
    
    return _cache_instance
