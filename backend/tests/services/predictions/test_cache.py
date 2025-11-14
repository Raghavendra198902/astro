"""
Unit Tests for Prediction Caching Service
"""

import pytest
import json
from unittest.mock import AsyncMock, patch
from datetime import datetime

from app.services.predictions.cache import PredictionCache, init_prediction_cache, get_prediction_cache


class TestPredictionCache:
    """Test PredictionCache functionality"""
    
    @pytest.fixture
    def mock_redis(self):
        """Create mock Redis client"""
        mock = AsyncMock()
        mock.get.return_value = None
        mock.setex.return_value = True
        mock.delete.return_value = 1
        mock.keys.return_value = []
        mock.info.return_value = {
            "keyspace_hits": 100,
            "keyspace_misses": 50,
            "used_memory_human": "1.5M"
        }
        return mock
    
    @pytest.fixture
    def cache_service(self, mock_redis):
        """Create cache service with mock Redis"""
        return PredictionCache(redis_client=mock_redis, ttl=3600)
    
    @pytest.fixture
    def sample_prediction_data(self):
        """Sample prediction data"""
        return {
            "success": True,
            "request_id": "test123",
            "past_events": [],
            "future_events": [],
            "accuracy_score": 81.5
        }
    
    def test_cache_initialization_with_redis(self, mock_redis):
        """Test cache initializes with Redis client"""
        cache = PredictionCache(redis_client=mock_redis, ttl=1800)
        
        assert cache.enabled is True
        assert cache.ttl == 1800
        assert cache.redis_client is mock_redis
    
    def test_cache_initialization_without_redis(self):
        """Test cache initializes in disabled mode without Redis"""
        cache = PredictionCache(redis_client=None)
        
        assert cache.enabled is False
        assert cache.redis_client is None
    
    @pytest.mark.asyncio
    async def test_get_cache_miss(self, cache_service, mock_redis):
        """Test cache get returns None on miss"""
        mock_redis.get.return_value = None
        
        result = await cache_service.get("test_key")
        
        assert result is None
        mock_redis.get.assert_called_once_with("test_key")
    
    @pytest.mark.asyncio
    async def test_get_cache_hit(self, cache_service, mock_redis, sample_prediction_data):
        """Test cache get returns data on hit"""
        mock_redis.get.return_value = json.dumps(sample_prediction_data)
        
        result = await cache_service.get("test_key")
        
        assert result == sample_prediction_data
        assert result["success"] is True
        assert result["accuracy_score"] == 81.5
    
    @pytest.mark.asyncio
    async def test_get_disabled_cache(self, sample_prediction_data):
        """Test cache get returns None when disabled"""
        cache = PredictionCache(redis_client=None)
        
        result = await cache.get("test_key")
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_set_cache_success(self, cache_service, mock_redis, sample_prediction_data):
        """Test cache set stores data successfully"""
        result = await cache_service.set("test_key", sample_prediction_data, ttl=1800)
        
        assert result is True
        mock_redis.setex.assert_called_once()
        
        # Verify correct arguments
        call_args = mock_redis.setex.call_args[0]
        assert call_args[0] == "test_key"  # key
        assert call_args[1] == 1800  # ttl
        assert json.loads(call_args[2]) == sample_prediction_data  # data
    
    @pytest.mark.asyncio
    async def test_set_cache_default_ttl(self, cache_service, mock_redis, sample_prediction_data):
        """Test cache set uses default TTL when not specified"""
        await cache_service.set("test_key", sample_prediction_data)
        
        call_args = mock_redis.setex.call_args[0]
        assert call_args[1] == 3600  # default TTL
    
    @pytest.mark.asyncio
    async def test_set_disabled_cache(self, sample_prediction_data):
        """Test cache set returns False when disabled"""
        cache = PredictionCache(redis_client=None)
        
        result = await cache.set("test_key", sample_prediction_data)
        
        assert result is False
    
    @pytest.mark.asyncio
    async def test_delete_cache_success(self, cache_service, mock_redis):
        """Test cache delete removes key successfully"""
        result = await cache_service.delete("test_key")
        
        assert result is True
        mock_redis.delete.assert_called_once_with("test_key")
    
    @pytest.mark.asyncio
    async def test_delete_disabled_cache(self):
        """Test cache delete returns False when disabled"""
        cache = PredictionCache(redis_client=None)
        
        result = await cache.delete("test_key")
        
        assert result is False
    
    @pytest.mark.asyncio
    async def test_clear_user_cache(self, cache_service, mock_redis):
        """Test clearing all cache entries for a user"""
        mock_redis.keys.return_value = ["key1", "key2", "key3"]
        mock_redis.delete.return_value = 3
        
        deleted_count = await cache_service.clear_user_cache("user123")
        
        assert deleted_count == 3
        mock_redis.keys.assert_called_once_with("prediction:*user123*")
        mock_redis.delete.assert_called_once_with("key1", "key2", "key3")
    
    @pytest.mark.asyncio
    async def test_clear_user_cache_no_keys(self, cache_service, mock_redis):
        """Test clearing user cache when no keys exist"""
        mock_redis.keys.return_value = []
        
        deleted_count = await cache_service.clear_user_cache("user123")
        
        assert deleted_count == 0
        mock_redis.delete.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_get_stats(self, cache_service, mock_redis):
        """Test getting cache statistics"""
        stats = await cache_service.get_stats()
        
        assert stats["enabled"] is True
        assert stats["keyspace_hits"] == 100
        assert stats["keyspace_misses"] == 50
        assert stats["hit_rate"] == 66.67  # 100/(100+50) * 100
        assert stats["used_memory_human"] == "1.5M"
    
    @pytest.mark.asyncio
    async def test_get_stats_disabled(self):
        """Test getting stats for disabled cache"""
        cache = PredictionCache(redis_client=None)
        
        stats = await cache.get_stats()
        
        assert stats["enabled"] is False
    
    @pytest.mark.asyncio
    async def test_cache_error_handling(self, cache_service, mock_redis):
        """Test cache handles Redis errors gracefully"""
        mock_redis.get.side_effect = Exception("Redis connection error")
        
        result = await cache_service.get("test_key")
        
        assert result is None  # Should not raise exception
    
    @pytest.mark.asyncio
    async def test_hit_rate_calculation_zero_requests(self, cache_service):
        """Test hit rate calculation with zero requests"""
        info = {"keyspace_hits": 0, "keyspace_misses": 0}
        hit_rate = cache_service._calculate_hit_rate(info)
        
        assert hit_rate == 0.0
    
    @pytest.mark.asyncio
    async def test_hit_rate_calculation_all_hits(self, cache_service):
        """Test hit rate calculation with 100% hits"""
        info = {"keyspace_hits": 150, "keyspace_misses": 0}
        hit_rate = cache_service._calculate_hit_rate(info)
        
        assert hit_rate == 100.0


class TestCacheGlobalInstance:
    """Test global cache instance management"""
    
    def test_init_prediction_cache(self):
        """Test initializing global cache instance"""
        mock_redis = AsyncMock()
        
        cache = init_prediction_cache(mock_redis, ttl=7200)
        
        assert cache is not None
        assert cache.enabled is True
        assert cache.ttl == 7200
    
    def test_get_prediction_cache_initialized(self):
        """Test getting initialized cache instance"""
        mock_redis = AsyncMock()
        init_prediction_cache(mock_redis)
        
        cache = get_prediction_cache()
        
        assert cache is not None
        assert cache.enabled is True
    
    def test_get_prediction_cache_not_initialized(self):
        """Test getting cache when not initialized returns disabled instance"""
        # Reset global instance
        import app.services.predictions.cache as cache_module
        cache_module._cache_instance = None
        
        cache = get_prediction_cache()
        
        assert cache is not None
        assert cache.enabled is False


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=app.services.predictions.cache"])
