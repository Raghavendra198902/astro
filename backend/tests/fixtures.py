"""Common test fixtures and utilities"""

from datetime import datetime, timezone
from typing import Dict, Any


class TestDataFactory:
    """Factory for creating test data"""
    
    @staticmethod
    def create_user_data(email: str = "test@example.com", **kwargs) -> Dict[str, Any]:
        """Create user registration data"""
        return {
            "email": email,
            "password": "TestPassword123!",
            "role": "seeker",
            **kwargs
        }
    
    @staticmethod
    def create_profile_data(name: str = "Test User", **kwargs) -> Dict[str, Any]:
        """Create profile data"""
        return {
            "name": name,
            "dob_ts_utc": "1990-01-15T10:30:00Z",
            "birthplace_text": "New York, NY, USA",
            "birthplace_lat": 40.7128,
            "birthplace_lon": -74.0060,
            "birthplace_tz": "America/New_York",
            **kwargs
        }
    
    @staticmethod
    def create_chart_request(**kwargs) -> Dict[str, Any]:
        """Create chart generation request"""
        return {
            "date": "1990-01-15",
            "time": "10:30:00",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "timezone": "America/New_York",
            "system": "vedic",
            "ayanamsha": "lahiri",
            **kwargs
        }
    
    @staticmethod
    def create_numerology_request(**kwargs) -> Dict[str, Any]:
        """Create numerology calculation request"""
        return {
            "full_name": "John Michael Smith",
            "birth_date": "1990-01-15",
            "system": "pythagorean",
            **kwargs
        }
    
    @staticmethod
    def create_compatibility_request(**kwargs) -> Dict[str, Any]:
        """Create compatibility analysis request"""
        return {
            "person1": {
                "name": "Person A",
                "date": "1990-01-15",
                "time": "10:30:00",
                "latitude": 40.7128,
                "longitude": -74.0060,
                "timezone": "America/New_York",
            },
            "person2": {
                "name": "Person B",
                "date": "1992-05-20",
                "time": "14:15:00",
                "latitude": 34.0522,
                "longitude": -118.2437,
                "timezone": "America/Los_Angeles",
            },
            **kwargs
        }


class MockResponses:
    """Mock response data for external services"""
    
    @staticmethod
    def llm_interpretation() -> Dict[str, Any]:
        """Mock LLM interpretation response"""
        return {
            "interpretation": "This is a comprehensive astrological interpretation. "
                            "The native has strong leadership qualities indicated by "
                            "Sun in the 10th house. Moon in the 4th house suggests "
                            "emotional connection to home and family.",
            "confidence": 0.87,
            "tokens_used": 250,
            "cost": 0.005,
        }
    
    @staticmethod
    def chart_calculation() -> Dict[str, Any]:
        """Mock chart calculation result"""
        return {
            "planets": {
                "sun": {
                    "longitude": 294.5123,
                    "latitude": 0.0002,
                    "sign": "Capricorn",
                    "sign_num": 10,
                    "degree": 24.5123,
                    "house": 10,
                    "retrograde": False,
                },
                "moon": {
                    "longitude": 120.3456,
                    "latitude": 5.1234,
                    "sign": "Cancer",
                    "sign_num": 4,
                    "degree": 0.3456,
                    "house": 4,
                    "retrograde": False,
                },
                "mars": {
                    "longitude": 45.7890,
                    "latitude": 1.2345,
                    "sign": "Taurus",
                    "sign_num": 2,
                    "degree": 15.7890,
                    "house": 2,
                    "retrograde": False,
                },
                "mercury": {
                    "longitude": 280.1234,
                    "latitude": 0.5678,
                    "sign": "Capricorn",
                    "sign_num": 10,
                    "degree": 10.1234,
                    "house": 9,
                    "retrograde": True,
                },
            },
            "houses": {
                "1": {"cusp": 0.0, "sign": "Aries", "sign_num": 1},
                "2": {"cusp": 30.0, "sign": "Taurus", "sign_num": 2},
                "3": {"cusp": 60.0, "sign": "Gemini", "sign_num": 3},
                "4": {"cusp": 90.0, "sign": "Cancer", "sign_num": 4},
                "5": {"cusp": 120.0, "sign": "Leo", "sign_num": 5},
                "6": {"cusp": 150.0, "sign": "Virgo", "sign_num": 6},
                "7": {"cusp": 180.0, "sign": "Libra", "sign_num": 7},
                "8": {"cusp": 210.0, "sign": "Scorpio", "sign_num": 8},
                "9": {"cusp": 240.0, "sign": "Sagittarius", "sign_num": 9},
                "10": {"cusp": 270.0, "sign": "Capricorn", "sign_num": 10},
                "11": {"cusp": 300.0, "sign": "Aquarius", "sign_num": 11},
                "12": {"cusp": 330.0, "sign": "Pisces", "sign_num": 12},
            },
            "aspects": [
                {
                    "planet1": "sun",
                    "planet2": "moon",
                    "aspect": "trine",
                    "orb": 2.34,
                    "applying": True,
                },
                {
                    "planet1": "mars",
                    "planet2": "mercury",
                    "aspect": "square",
                    "orb": 5.67,
                    "applying": False,
                },
            ],
            "ascendant": 0.0,
            "midheaven": 270.0,
        }
    
    @staticmethod
    def numerology_calculation() -> Dict[str, Any]:
        """Mock numerology calculation result"""
        return {
            "life_path": 7,
            "expression": 5,
            "soul_urge": 3,
            "personality": 2,
            "birthday": 6,
            "maturity": 3,
            "interpretations": {
                "life_path": "The number 7 represents spiritual seeking and analysis.",
                "expression": "The number 5 indicates versatility and freedom.",
                "soul_urge": "The number 3 suggests creativity and communication.",
            }
        }
    
    @staticmethod
    def payment_success() -> Dict[str, Any]:
        """Mock successful payment response"""
        return {
            "payment_id": "pay_test_123456",
            "status": "success",
            "amount": 999,
            "currency": "INR",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }


class AssertionHelpers:
    """Helper methods for common assertions"""
    
    @staticmethod
    def assert_valid_chart_structure(chart_data: Dict[str, Any]):
        """Assert chart data has valid structure"""
        assert "planets" in chart_data
        assert "houses" in chart_data
        assert "ascendant" in chart_data
        
        # Check planets
        required_planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"]
        for planet in required_planets:
            assert planet in chart_data["planets"]
            assert "longitude" in chart_data["planets"][planet]
            assert "sign" in chart_data["planets"][planet]
    
    @staticmethod
    def assert_valid_interpretation(interpretation: Dict[str, Any]):
        """Assert interpretation has valid structure"""
        assert "interpretation" in interpretation
        assert "confidence" in interpretation
        assert isinstance(interpretation["interpretation"], str)
        assert 0.0 <= interpretation["confidence"] <= 1.0
    
    @staticmethod
    def assert_valid_numerology(result: Dict[str, Any]):
        """Assert numerology result has valid structure"""
        required_numbers = ["life_path", "expression", "soul_urge", "personality"]
        for num_type in required_numbers:
            assert num_type in result
            assert 1 <= result[num_type] <= 9 or result[num_type] in [11, 22, 33]
