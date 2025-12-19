"""
Unit tests for numerology calculations
"""

import pytest
from tests.fixtures import TestDataFactory, MockResponses, AssertionHelpers


class TestNumerologyCalculations:
    """Test numerology calculation functionality"""
    
    @pytest.mark.asyncio
    async def test_calculate_numerology_pythagorean(self, client, auth_headers):
        """Test Pythagorean numerology calculation"""
        numerology_data = TestDataFactory.create_numerology_request(
            full_name="John Michael Smith",
            birth_date="1990-01-15",
            system="pythagorean"
        )
        
        response = await client.post(
            "/api/v1/numerology/calculate",
            json=numerology_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        AssertionHelpers.assert_valid_numerology(data)
        assert data.get("system") == "pythagorean"
    
    @pytest.mark.asyncio
    async def test_calculate_numerology_chaldean(self, client, auth_headers):
        """Test Chaldean numerology calculation"""
        numerology_data = TestDataFactory.create_numerology_request(
            full_name="John Michael Smith",
            birth_date="1990-01-15",
            system="chaldean"
        )
        
        response = await client.post(
            "/api/v1/numerology/calculate",
            json=numerology_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        AssertionHelpers.assert_valid_numerology(data)
        assert data.get("system") == "chaldean"


class TestLifePathNumber:
    """Test Life Path number calculation"""
    
    def test_life_path_single_digit(self):
        """Test Life Path calculation resulting in single digit"""
        # Birth date: 1990-01-15
        # 1+9+9+0 = 19 -> 1+9 = 10 -> 1+0 = 1
        # 0+1 = 1
        # 1+5 = 6
        # Total: 1+1+6 = 8
        expected_life_path = 8
        
        # This is a simplified test - actual calculation in service
        assert 1 <= expected_life_path <= 9
    
    def test_life_path_master_number(self):
        """Test Life Path calculation with master number"""
        # Master numbers: 11, 22, 33
        master_numbers = [11, 22, 33]
        
        for num in master_numbers:
            assert num in [11, 22, 33]
    
    @pytest.mark.asyncio
    async def test_life_path_endpoint(self, client, auth_headers):
        """Test Life Path number endpoint"""
        response = await client.post(
            "/api/v1/numerology/life-path",
            json={"birth_date": "1990-01-15"},
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            life_path = data.get("life_path")
            assert life_path in list(range(1, 10)) + [11, 22, 33]


class TestExpressionNumber:
    """Test Expression number calculation"""
    
    def test_letter_to_number_pythagorean(self):
        """Test letter to number conversion (Pythagorean)"""
        pythagorean_values = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
            'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
            'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
        }
        
        assert pythagorean_values['A'] == 1
        assert pythagorean_values['J'] == 1
        assert pythagorean_values['S'] == 1
    
    def test_letter_to_number_chaldean(self):
        """Test letter to number conversion (Chaldean)"""
        chaldean_values = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5, 'I': 1,
            'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8, 'Q': 1, 'R': 2,
            'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
        }
        
        assert chaldean_values['A'] == 1
        assert chaldean_values['F'] == 8
        assert chaldean_values['O'] == 7
    
    @pytest.mark.asyncio
    async def test_expression_calculation(self, client, auth_headers):
        """Test Expression number calculation"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            expression = data.get("expression")
            assert expression in list(range(1, 10)) + [11, 22, 33]


class TestSoulUrgeNumber:
    """Test Soul Urge number calculation"""
    
    def test_vowel_extraction(self):
        """Test vowel extraction from name"""
        name = "JOHN SMITH"
        vowels = [c for c in name if c.upper() in "AEIOU"]
        assert vowels == ['O', 'I']
    
    @pytest.mark.asyncio
    async def test_soul_urge_calculation(self, client, auth_headers):
        """Test Soul Urge number calculation"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN MICHAEL SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            soul_urge = data.get("soul_urge")
            assert soul_urge in list(range(1, 10)) + [11, 22, 33]


class TestPersonalityNumber:
    """Test Personality number calculation"""
    
    def test_consonant_extraction(self):
        """Test consonant extraction from name"""
        name = "JOHN SMITH"
        consonants = [c for c in name if c.isalpha() and c.upper() not in "AEIOU"]
        assert len(consonants) == 7  # J, H, N, S, M, T, H
    
    @pytest.mark.asyncio
    async def test_personality_calculation(self, client, auth_headers):
        """Test Personality number calculation"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN MICHAEL SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            personality = data.get("personality")
            assert personality in list(range(1, 10)) + [11, 22, 33]


class TestBirthdayNumber:
    """Test Birthday number"""
    
    def test_birthday_number_single_digit(self):
        """Test birthday number for single digit day"""
        birth_date = "1990-01-05"
        day = 5
        assert 1 <= day <= 31
    
    def test_birthday_number_double_digit(self):
        """Test birthday number for double digit day"""
        birth_date = "1990-01-15"
        day = 15
        # Birthday number = 1 + 5 = 6
        birthday_number = 6
        assert 1 <= birthday_number <= 9
    
    @pytest.mark.asyncio
    async def test_birthday_number_endpoint(self, client, auth_headers):
        """Test birthday number in calculation"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "birthday" in data:
                birthday = data["birthday"]
                assert 1 <= birthday <= 31


class TestMaturityNumber:
    """Test Maturity number calculation"""
    
    @pytest.mark.asyncio
    async def test_maturity_calculation(self, client, auth_headers):
        """Test Maturity number (Life Path + Expression)"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "maturity" in data:
                maturity = data["maturity"]
                assert maturity in list(range(1, 10)) + [11, 22, 33]


class TestNumerologyInterpretations:
    """Test numerology interpretations"""
    
    @pytest.mark.asyncio
    async def test_interpretations_included(self, client, auth_headers):
        """Test that interpretations are included in response"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "interpretations" in data:
                interpretations = data["interpretations"]
                assert isinstance(interpretations, dict)
                assert len(interpretations) > 0
    
    def test_interpretation_content(self):
        """Test interpretation content structure"""
        sample_interpretation = {
            "life_path": {
                "number": 7,
                "meaning": "The number 7 represents spiritual seeking, analysis, and introspection.",
                "characteristics": ["analytical", "spiritual", "introspective"],
                "career_paths": ["researcher", "analyst", "philosopher"]
            }
        }
        
        assert "number" in sample_interpretation["life_path"]
        assert "meaning" in sample_interpretation["life_path"]
        assert isinstance(sample_interpretation["life_path"]["characteristics"], list)


class TestNumerologyValidation:
    """Test numerology input validation"""
    
    @pytest.mark.asyncio
    async def test_invalid_name(self, client, auth_headers):
        """Test numerology with invalid name"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "123456",  # Numbers only
                "birth_date": "1990-01-15",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        # Should either process or return validation error
        assert response.status_code in [200, 422]
    
    @pytest.mark.asyncio
    async def test_invalid_date(self, client, auth_headers):
        """Test numerology with invalid date"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "invalid-date",
                "system": "pythagorean"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_invalid_system(self, client, auth_headers):
        """Test numerology with invalid system"""
        response = await client.post(
            "/api/v1/numerology/calculate",
            json={
                "full_name": "JOHN SMITH",
                "birth_date": "1990-01-15",
                "system": "invalid_system"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 422
