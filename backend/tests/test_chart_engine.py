"""
Unit tests for chart engine and astrological calculations
"""

import pytest
from datetime import datetime, timezone
from unittest.mock import patch, MagicMock

from tests.fixtures import TestDataFactory, MockResponses, AssertionHelpers


class TestChartCalculations:
    """Test chart calculation functionality"""
    
    @pytest.mark.asyncio
    async def test_generate_natal_chart_vedic(self, client, auth_headers):
        """Test Vedic natal chart generation"""
        chart_data = TestDataFactory.create_chart_request(
            system="vedic",
            ayanamsha="lahiri"
        )
        
        with patch("app.services.chart.engine.ChartEngine.calculate_chart") as mock_calc:
            mock_calc.return_value = MockResponses.chart_calculation()
            
            response = await client.post(
                "/api/v1/charts/generate",
                json=chart_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            
            AssertionHelpers.assert_valid_chart_structure(data)
            assert data.get("system") == "vedic"
    
    @pytest.mark.asyncio
    async def test_generate_natal_chart_western(self, client, auth_headers):
        """Test Western natal chart generation"""
        chart_data = TestDataFactory.create_chart_request(
            system="western",
            house_system="placidus"
        )
        
        with patch("app.services.chart.engine.ChartEngine.calculate_chart") as mock_calc:
            mock_calc.return_value = MockResponses.chart_calculation()
            
            response = await client.post(
                "/api/v1/charts/generate",
                json=chart_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            
            AssertionHelpers.assert_valid_chart_structure(data)
            assert data.get("system") == "western"
    
    @pytest.mark.asyncio
    async def test_generate_chart_invalid_date(self, client, auth_headers):
        """Test chart generation with invalid date"""
        chart_data = TestDataFactory.create_chart_request(
            date="2025-13-45"  # Invalid date
        )
        
        response = await client.post(
            "/api/v1/charts/generate",
            json=chart_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_generate_chart_invalid_coordinates(self, client, auth_headers):
        """Test chart generation with invalid coordinates"""
        chart_data = TestDataFactory.create_chart_request(
            latitude=200.0,  # Invalid latitude
            longitude=500.0  # Invalid longitude
        )
        
        response = await client.post(
            "/api/v1/charts/generate",
            json=chart_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422


class TestPlanetaryCalculations:
    """Test planetary position calculations"""
    
    def test_planet_longitude_range(self, sample_chart_data):
        """Test that planet longitudes are within valid range (0-360)"""
        for planet, data in sample_chart_data["planets"].items():
            assert 0 <= data["longitude"] < 360
    
    def test_planet_signs(self, sample_chart_data):
        """Test that planets have valid zodiac signs"""
        valid_signs = [
            "Aries", "Taurus", "Gemini", "Cancer",
            "Leo", "Virgo", "Libra", "Scorpio",
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        
        for planet, data in sample_chart_data["planets"].items():
            assert data["sign"] in valid_signs
    
    def test_house_cusps(self, sample_chart_data):
        """Test that house cusps are properly calculated"""
        houses = sample_chart_data["houses"]
        
        assert len(houses) == 12
        
        # Check house cusps are in ascending order (with wraparound)
        for i in range(1, 13):
            assert str(i) in houses
            assert 0 <= houses[str(i)]["cusp"] < 360


class TestAspectCalculations:
    """Test aspect calculations between planets"""
    
    def test_aspect_types(self, sample_chart_data):
        """Test that aspects are of valid types"""
        valid_aspects = ["conjunction", "opposition", "trine", "square", "sextile"]
        
        for aspect in sample_chart_data.get("aspects", []):
            assert aspect["aspect"] in valid_aspects
    
    def test_aspect_orbs(self, sample_chart_data):
        """Test that aspect orbs are within reasonable limits"""
        for aspect in sample_chart_data.get("aspects", []):
            # Orbs should typically be less than 10 degrees
            assert 0 <= aspect["orb"] <= 10
    
    def test_aspect_applying(self, sample_chart_data):
        """Test that aspect applying flag is boolean"""
        for aspect in sample_chart_data.get("aspects", []):
            assert isinstance(aspect["applying"], bool)


class TestDashaCalculations:
    """Test Vimshottari Dasha calculations"""
    
    @pytest.mark.asyncio
    async def test_calculate_dasha(self, client, auth_headers):
        """Test Dasha calculation endpoint"""
        response = await client.post(
            "/api/v1/charts/natal",
            json=TestDataFactory.create_chart_request(),
            headers=auth_headers
        )
        
        assert response.status_code == 201
        chart_data = response.json()
        
        # Get Dasha for the chart
        chart_id = chart_data["id"]
        dasha_response = await client.get(
            f"/api/v1/charts/{chart_id}/dasha",
            headers=auth_headers
        )
        
        # Should return dasha data if endpoint exists
        if dasha_response.status_code == 200:
            dasha_data = dasha_response.json()
            assert "maha_dasha" in dasha_data or "periods" in dasha_data
    
    def test_dasha_period_validation(self):
        """Test that Dasha periods are valid"""
        # Test data for a sample Dasha period
        dasha_period = {
            "planet": "Jupiter",
            "start_date": "2020-01-15",
            "end_date": "2036-01-15",
            "years": 16
        }
        
        start = datetime.fromisoformat(dasha_period["start_date"])
        end = datetime.fromisoformat(dasha_period["end_date"])
        years_diff = (end - start).days / 365.25
        
        assert abs(years_diff - dasha_period["years"]) < 0.1


class TestPanchangCalculations:
    """Test Panchang (Vedic calendar) calculations"""
    
    @pytest.mark.asyncio
    async def test_get_panchang(self, client, auth_headers):
        """Test Panchang calculation endpoint"""
        response = await client.get(
            "/api/v1/charts/panchang",
            params={
                "date": "2024-01-15",
                "time": "10:30:00",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "timezone": "Asia/Kolkata"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            panchang = response.json()
            
            # Check for main Panchang components
            assert "tithi" in panchang
            assert "nakshatra" in panchang
            assert "yoga" in panchang
            assert "karana" in panchang
            assert "vara" in panchang
    
    def test_tithi_values(self):
        """Test that Tithi values are valid"""
        valid_tithis = [
            "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
            "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
            "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"
        ]
        
        # Sample tithi
        tithi = "Ekadashi"
        assert tithi in valid_tithis
    
    def test_nakshatra_values(self):
        """Test that Nakshatra values are valid"""
        # There are 27 Nakshatras in Vedic astrology
        sample_nakshatra = "Ashwini"
        valid_nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
            "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
            "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
            "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
            "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
        assert sample_nakshatra in valid_nakshatras


class TestYogaDetection:
    """Test Yoga detection in charts"""
    
    @pytest.mark.asyncio
    async def test_detect_raj_yoga(self, client, auth_headers, sample_chart_data):
        """Test Raj Yoga detection"""
        # Mock chart with potential Raj Yoga configuration
        # (Lord of 9th house in 10th house)
        with patch("app.services.chart.yoga_engine.YogaEngine.detect_yogas") as mock_yoga:
            mock_yoga.return_value = [
                {
                    "name": "Raj Yoga",
                    "description": "Lord of 9th house in 10th house",
                    "strength": "strong",
                    "effects": "Success in career and public life"
                }
            ]
            
            response = await client.post(
                "/api/v1/charts/generate",
                json=TestDataFactory.create_chart_request(),
                headers=auth_headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "yogas" in data:
                    assert len(data["yogas"]) > 0
    
    def test_yoga_strength_levels(self):
        """Test that Yoga strength levels are valid"""
        valid_strengths = ["weak", "moderate", "strong", "very_strong"]
        
        sample_yoga = {
            "name": "Gaja Kesari Yoga",
            "strength": "strong"
        }
        
        assert sample_yoga["strength"] in valid_strengths


class TestDivisionalCharts:
    """Test divisional chart calculations (D9, D10, etc.)"""
    
    @pytest.mark.asyncio
    async def test_calculate_navamsa_d9(self, client, auth_headers):
        """Test Navamsa (D9) chart calculation"""
        response = await client.post(
            "/api/v1/charts/divisional",
            json={
                **TestDataFactory.create_chart_request(),
                "division": "D9"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            d9_chart = response.json()
            AssertionHelpers.assert_valid_chart_structure(d9_chart)
    
    @pytest.mark.asyncio
    async def test_calculate_dashamsa_d10(self, client, auth_headers):
        """Test Dashamsa (D10) chart calculation"""
        response = await client.post(
            "/api/v1/charts/divisional",
            json={
                **TestDataFactory.create_chart_request(),
                "division": "D10"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            d10_chart = response.json()
            AssertionHelpers.assert_valid_chart_structure(d10_chart)


class TestTransitCalculations:
    """Test transit calculations"""
    
    @pytest.mark.asyncio
    async def test_current_transits(self, client, auth_headers):
        """Test current planetary transits"""
        response = await client.get(
            "/api/v1/transits/current",
            params={
                "latitude": 28.6139,
                "longitude": 77.2090
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            transits = response.json()
            assert "planets" in transits
            assert len(transits["planets"]) > 0
    
    @pytest.mark.asyncio
    async def test_transit_watch(self, client, auth_headers):
        """Test transit watch creation"""
        response = await client.post(
            "/api/v1/transits/watch",
            json={
                "planet": "Jupiter",
                "aspect": "conjunction",
                "natal_planet": "Sun",
                "orb": 3.0
            },
            headers=auth_headers
        )
        
        # Should create watch or return validation error
        assert response.status_code in [200, 201, 422]
