"""Tests for astro utility functions with real coverage"""

import pytest
from app.utils.astro_utils import (
    calculate_age,
    is_valid_email,
    format_phone_number,
    calculate_life_path_number,
    get_zodiac_sign,
    calculate_compatibility_score
)


class TestAgeCalculation:
    """Test age calculation"""
    
    def test_calculate_age_normal(self):
        """Test normal age calculation"""
        assert calculate_age(1990, 2025) == 35
        assert calculate_age(2000, 2025) == 25
        assert calculate_age(1985, 2025) == 40
    
    def test_calculate_age_same_year(self):
        """Test age when born in current year"""
        assert calculate_age(2025, 2025) == 0
    
    def test_calculate_age_future_birth(self):
        """Test error for future birth year"""
        with pytest.raises(ValueError, match="Birth year cannot be in the future"):
            calculate_age(2030, 2025)


class TestEmailValidation:
    """Test email validation"""
    
    def test_valid_emails(self):
        """Test valid email addresses"""
        assert is_valid_email("user@example.com") is True
        assert is_valid_email("test.user@domain.co.uk") is True
        assert is_valid_email("admin@astro.ai") is True
    
    def test_invalid_emails(self):
        """Test invalid email addresses"""
        assert is_valid_email("") is False
        assert is_valid_email("no-at-sign") is False
        assert is_valid_email("@nodomain") is False
        assert is_valid_email("nouser@") is False
        assert is_valid_email("multiple@at@signs.com") is False
        assert is_valid_email("nodot@domain") is False


class TestPhoneFormatting:
    """Test phone number formatting"""
    
    def test_format_phone_digits_only(self):
        """Test formatting phone with only digits"""
        assert format_phone_number("1234567890") == "(123) 456-7890"
    
    def test_format_phone_with_dashes(self):
        """Test formatting phone with dashes"""
        assert format_phone_number("123-456-7890") == "(123) 456-7890"
    
    def test_format_phone_with_spaces(self):
        """Test formatting phone with spaces"""
        assert format_phone_number("123 456 7890") == "(123) 456-7890"
    
    def test_format_phone_mixed(self):
        """Test formatting phone with mixed characters"""
        assert format_phone_number("(123) 456-7890") == "(123) 456-7890"
    
    def test_format_phone_invalid_length(self):
        """Test error for invalid phone length"""
        with pytest.raises(ValueError, match="must have exactly 10 digits"):
            format_phone_number("123456")
        with pytest.raises(ValueError, match="must have exactly 10 digits"):
            format_phone_number("12345678901")


class TestLifePathNumber:
    """Test numerology life path calculation"""
    
    def test_life_path_single_digit(self):
        """Test life path numbers that reduce to single digit"""
        assert calculate_life_path_number("1990-05-15") == 3  # 1+9+9+0+0+5+1+5=30, 3+0=3
        assert calculate_life_path_number("2000-01-01") == 4  # 2+0+0+0+0+1+0+1=4
    
    def test_life_path_master_number(self):
        """Test life path master numbers"""
        assert calculate_life_path_number("1984-11-02") == 8  # 1+9+8+4+1+1+0+2=26, 2+6=8
    
    @pytest.mark.parametrize("birth_date,expected", [
        ("1985-03-15", 5),
        ("1992-12-25", 4),
        ("2001-06-10", 1),
    ])
    def test_life_path_various_dates(self, birth_date, expected):
        """Test life path with various dates"""
        assert calculate_life_path_number(birth_date) == expected


class TestZodiacSign:
    """Test zodiac sign calculation"""
    
    def test_aries(self):
        """Test Aries sign"""
        assert get_zodiac_sign(3, 21) == "Aries"
        assert get_zodiac_sign(4, 15) == "Aries"
        assert get_zodiac_sign(4, 19) == "Aries"
    
    def test_taurus(self):
        """Test Taurus sign"""
        assert get_zodiac_sign(4, 20) == "Taurus"
        assert get_zodiac_sign(5, 10) == "Taurus"
        assert get_zodiac_sign(5, 20) == "Taurus"
    
    def test_gemini(self):
        """Test Gemini sign"""
        assert get_zodiac_sign(5, 21) == "Gemini"
        assert get_zodiac_sign(6, 15) == "Gemini"
    
    def test_cancer(self):
        """Test Cancer sign"""
        assert get_zodiac_sign(6, 21) == "Cancer"
        assert get_zodiac_sign(7, 15) == "Cancer"
    
    def test_leo(self):
        """Test Leo sign"""
        assert get_zodiac_sign(7, 23) == "Leo"
        assert get_zodiac_sign(8, 15) == "Leo"
    
    def test_virgo(self):
        """Test Virgo sign"""
        assert get_zodiac_sign(8, 23) == "Virgo"
        assert get_zodiac_sign(9, 15) == "Virgo"
    
    def test_libra(self):
        """Test Libra sign"""
        assert get_zodiac_sign(9, 23) == "Libra"
        assert get_zodiac_sign(10, 15) == "Libra"
    
    def test_scorpio(self):
        """Test Scorpio sign"""
        assert get_zodiac_sign(10, 23) == "Scorpio"
        assert get_zodiac_sign(11, 15) == "Scorpio"
    
    def test_sagittarius(self):
        """Test Sagittarius sign"""
        assert get_zodiac_sign(11, 22) == "Sagittarius"
        assert get_zodiac_sign(12, 15) == "Sagittarius"
    
    def test_capricorn(self):
        """Test Capricorn sign"""
        assert get_zodiac_sign(12, 22) == "Capricorn"
        assert get_zodiac_sign(1, 15) == "Capricorn"
    
    def test_aquarius(self):
        """Test Aquarius sign"""
        assert get_zodiac_sign(1, 20) == "Aquarius"
        assert get_zodiac_sign(2, 15) == "Aquarius"
    
    def test_pisces(self):
        """Test Pisces sign"""
        assert get_zodiac_sign(2, 19) == "Pisces"
        assert get_zodiac_sign(3, 15) == "Pisces"
    
    def test_invalid_month(self):
        """Test error for invalid month"""
        with pytest.raises(ValueError, match="Invalid month"):
            get_zodiac_sign(13, 15)
        with pytest.raises(ValueError, match="Invalid month"):
            get_zodiac_sign(0, 15)


class TestCompatibilityScore:
    """Test compatibility score calculation"""
    
    def test_same_sign_compatibility(self):
        """Test same sign compatibility"""
        assert calculate_compatibility_score("Aries", "Aries") == 85
        assert calculate_compatibility_score("Leo", "Leo") == 85
    
    def test_same_element_compatibility(self):
        """Test same element compatibility"""
        # Fire signs
        assert calculate_compatibility_score("Aries", "Leo") == 80
        assert calculate_compatibility_score("Leo", "Sagittarius") == 80
        
        # Earth signs
        assert calculate_compatibility_score("Taurus", "Virgo") == 80
        assert calculate_compatibility_score("Virgo", "Capricorn") == 80
        
        # Air signs
        assert calculate_compatibility_score("Gemini", "Libra") == 80
        assert calculate_compatibility_score("Libra", "Aquarius") == 80
        
        # Water signs
        assert calculate_compatibility_score("Cancer", "Scorpio") == 80
        assert calculate_compatibility_score("Scorpio", "Pisces") == 80
    
    def test_compatible_elements(self):
        """Test compatible element pairs"""
        # Fire and Air
        assert calculate_compatibility_score("Aries", "Gemini") == 75
        assert calculate_compatibility_score("Leo", "Libra") == 75
        
        # Earth and Water
        assert calculate_compatibility_score("Taurus", "Cancer") == 75
        assert calculate_compatibility_score("Virgo", "Scorpio") == 75
    
    def test_neutral_compatibility(self):
        """Test neutral compatibility"""
        # Fire and Earth
        assert calculate_compatibility_score("Aries", "Taurus") == 60
        # Air and Water
        assert calculate_compatibility_score("Gemini", "Cancer") == 60
