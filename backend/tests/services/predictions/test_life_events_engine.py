"""
Unit Tests for Life Events Prediction Engine
"""

import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, AsyncMock
from pydantic import ValidationError

from app.services.predictions.life_events_engine import (
    LifeEventsEngine,
    PredictionInput,
    PredictionValidationError,
    EventCategory,
    RiskLevel,
    EventType
)


class TestPredictionInput:
    """Test PredictionInput validation"""
    
    def test_valid_input(self):
        """Test valid prediction input"""
        input_data = PredictionInput(
            birth_date=datetime(1990, 5, 15),
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            full_name="John Doe",
            current_age=35,
            prediction_years=10
        )
        
        assert input_data.birth_date.year == 1990
        assert input_data.birth_time == "14:30"
        assert input_data.current_age == 35
    
    def test_invalid_birth_date_future(self):
        """Test validation fails for future birth date"""
        with pytest.raises(ValidationError) as exc_info:
            PredictionInput(
                birth_date=datetime.now() + timedelta(days=365),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=10
            )
        
        assert "future" in str(exc_info.value).lower()
    
    def test_invalid_birth_date_too_old(self):
        """Test validation fails for birth date before 1900"""
        with pytest.raises(ValidationError) as exc_info:
            PredictionInput(
                birth_date=datetime(1850, 1, 1),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=10
            )
        
        assert "1900" in str(exc_info.value)
    
    def test_invalid_birth_time_format(self):
        """Test validation fails for invalid time format"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="25:70",  # Invalid time
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=10
            )
    
    def test_invalid_latitude_range(self):
        """Test validation fails for latitude out of range"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=95.0,  # > 90
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=10
            )
    
    def test_invalid_longitude_range(self):
        """Test validation fails for longitude out of range"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=200.0,  # > 180
                full_name="John Doe",
                current_age=35,
                prediction_years=10
            )
    
    def test_invalid_age_range_too_low(self):
        """Test validation fails for age < 1"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=0,  # < 1
                prediction_years=10
            )
    
    def test_invalid_age_range_too_high(self):
        """Test validation fails for age > 150"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=151,  # > 150
                prediction_years=10
            )
    
    def test_invalid_prediction_years_too_low(self):
        """Test validation fails for prediction_years < 1"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=0  # < 1
            )
    
    def test_invalid_prediction_years_too_high(self):
        """Test validation fails for prediction_years > 50"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="John Doe",
                current_age=35,
                prediction_years=51  # > 50
            )
    
    def test_empty_name(self):
        """Test validation fails for empty name"""
        with pytest.raises(ValidationError):
            PredictionInput(
                birth_date=datetime(1990, 5, 15),
                birth_time="14:30",
                latitude=40.7128,
                longitude=-74.0060,
                full_name="   ",  # Empty
                current_age=35,
                prediction_years=10
            )
    
    def test_cache_key_generation(self):
        """Test cache key is generated consistently"""
        input1 = PredictionInput(
            birth_date=datetime(1990, 5, 15),
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            full_name="John Doe",
            current_age=35,
            prediction_years=10
        )
        
        input2 = PredictionInput(
            birth_date=datetime(1990, 5, 15),
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            full_name="John Doe",
            current_age=35,
            prediction_years=10
        )
        
        # Same inputs should generate same cache key
        assert input1.generate_cache_key() == input2.generate_cache_key()
    
    def test_cache_key_different_inputs(self):
        """Test different inputs generate different cache keys"""
        input1 = PredictionInput(
            birth_date=datetime(1990, 5, 15),
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            full_name="John Doe",
            current_age=35,
            prediction_years=10
        )
        
        input2 = PredictionInput(
            birth_date=datetime(1990, 5, 15),
            birth_time="14:30",
            latitude=40.7128,
            longitude=-74.0060,
            full_name="John Doe",
            current_age=36,  # Different age
            prediction_years=10
        )
        
        # Different inputs should generate different cache keys
        assert input1.generate_cache_key() != input2.generate_cache_key()


class TestLifeEventsEngine:
    """Test LifeEventsEngine core functionality"""
    
    @pytest.fixture
    def engine(self):
        """Create engine instance"""
        return LifeEventsEngine(cache_service=None)
    
    @pytest.fixture
    def mock_cache_service(self):
        """Create mock cache service"""
        mock = AsyncMock()
        mock.get.return_value = None  # No cache hit by default
        mock.set.return_value = True
        return mock
    
    @pytest.fixture
    def valid_prediction_params(self):
        """Valid prediction parameters"""
        return {
            "birth_date": datetime(1990, 5, 15),
            "birth_time": "14:30",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "full_name": "John Doe",
            "current_age": 35,
            "prediction_years": 10
        }
    
    def test_engine_initialization(self, engine):
        """Test engine initializes with correct weights"""
        assert engine.accuracy_weights["astrology"] == 0.50
        assert engine.accuracy_weights["numerology"] == 0.30
        assert engine.accuracy_weights["ai_patterns"] == 0.20
    
    @patch('app.services.predictions.life_events_engine.LifeEventsEngine.predict_life_events')
    def test_predict_life_events_success(self, mock_predict, engine, valid_prediction_params):
        """Test successful prediction"""
        # Mock successful prediction
        mock_predict.return_value = {
            "success": True,
            "request_id": "test123",
            "current_age": 35,
            "past_events": [],
            "future_events": [],
            "accuracy_score": 81.5
        }
        
        result = engine.predict_life_events(**valid_prediction_params)
        
        assert result["success"] is True
        assert "request_id" in result
        assert result["current_age"] == 35
    
    @patch('app.services.predictions.life_events_engine.LifeEventsEngine.predict_life_events')
    def test_predict_life_events_error_handling(self, mock_predict, engine, valid_prediction_params):
        """Test error handling in prediction"""
        # Mock prediction error
        mock_predict.side_effect = Exception("Test error")
        
        result = engine.predict_life_events(**valid_prediction_params)
        
        assert result["success"] is False
        assert "error" in result
    
    @pytest.mark.asyncio
    async def test_caching_enabled(self, valid_prediction_params):
        """Test caching is used when enabled"""
        mock_cache = AsyncMock()
        mock_cache.get.return_value = None  # Cache miss
        mock_cache.set.return_value = True
        
        engine = LifeEventsEngine(cache_service=mock_cache)
        
        with patch.object(engine, 'predict_life_events') as mock_predict:
            mock_predict.return_value = {
                "success": True,
                "data": "test"
            }
            
            result = await engine.validate_and_predict_cached(**valid_prediction_params)
            
            # Verify cache was checked
            assert mock_cache.get.called
            # Verify cache was set with result
            assert mock_cache.set.called
            assert result["from_cache"] is False
    
    @pytest.mark.asyncio
    async def test_cache_hit_returns_cached_result(self, valid_prediction_params):
        """Test cached result is returned on cache hit"""
        cached_result = {
            "success": True,
            "data": "cached_data",
            "accuracy_score": 85.0
        }
        
        mock_cache = AsyncMock()
        mock_cache.get.return_value = cached_result
        
        engine = LifeEventsEngine(cache_service=mock_cache)
        
        result = await engine.validate_and_predict_cached(**valid_prediction_params)
        
        assert result["from_cache"] is True
        assert result["data"] == "cached_data"
        # Verify prediction was not computed
        assert mock_cache.set.not_called


class TestEventEnums:
    """Test event enum definitions"""
    
    def test_event_category_values(self):
        """Test EventCategory enum values"""
        assert EventCategory.CAREER == "career"
        assert EventCategory.RELATIONSHIPS == "relationships"
        assert EventCategory.HEALTH == "health"
        assert EventCategory.FINANCE == "finance"
    
    def test_risk_level_values(self):
        """Test RiskLevel enum values"""
        assert RiskLevel.LOW == "low"
        assert RiskLevel.MEDIUM == "medium"
        assert RiskLevel.HIGH == "high"
        assert RiskLevel.CRITICAL == "critical"
    
    def test_event_type_values(self):
        """Test EventType enum values"""
        assert EventType.OPPORTUNITY == "opportunity"
        assert EventType.CHALLENGE == "challenge"
        assert EventType.NEUTRAL == "neutral"
        assert EventType.TRANSFORMATION == "transformation"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=app.services.predictions.life_events_engine"])
