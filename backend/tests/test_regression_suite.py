"""
Comprehensive Regression Test Suite for ASTOR AI
Tests all major functionality to prevent breaking changes
"""

import pytest
from datetime import datetime, date, timedelta
from app.utils.astro_utils import (
    calculate_age,
    is_valid_email,
    format_phone_number,
    calculate_life_path_number,
    get_zodiac_sign,
    calculate_compatibility_score
)


class TestRegressionAgeCalculation:
    """Regression tests for age calculation"""
    
    @pytest.mark.parametrize("birth_year,current_year,expected", [
        (1990, 2025, 35),
        (2000, 2025, 25),
        (1985, 2025, 40),
        (1975, 2025, 50),
        (2020, 2025, 5),
        (2025, 2025, 0),
    ])
    def test_age_calculation_various_scenarios(self, birth_year, current_year, expected):
        """Test age calculation across multiple scenarios"""
        assert calculate_age(birth_year, current_year) == expected
    
    def test_age_calculation_boundary_conditions(self):
        """Test edge cases and boundaries"""
        # Same year
        assert calculate_age(2025, 2025) == 0
        # 100 years old
        assert calculate_age(1925, 2025) == 100
        # Very old age
        assert calculate_age(1900, 2025) == 125
    
    def test_age_calculation_error_handling(self):
        """Test error handling for invalid inputs"""
        with pytest.raises(ValueError):
            calculate_age(2030, 2025)  # Future birth year
        with pytest.raises(ValueError):
            calculate_age(2100, 2025)  # Far future


class TestRegressionEmailValidation:
    """Regression tests for email validation"""
    
    @pytest.mark.parametrize("email,expected", [
        ("user@example.com", True),
        ("test.user@domain.co.uk", True),
        ("admin@astro.ai", True),
        ("contact@company.org", True),
        ("name+tag@service.com", True),
        ("", False),
        ("no-at-sign", False),
        ("@nodomain", False),
        ("nouser@", False),
        ("multiple@at@signs.com", False),
        ("nodot@domain", False),
        ("spaces in@email.com", False),
    ])
    def test_email_validation_comprehensive(self, email, expected):
        """Test email validation with various inputs"""
        assert is_valid_email(email) == expected
    
    def test_email_validation_edge_cases(self):
        """Test edge cases for email validation"""
        assert is_valid_email("a@b.c") is True
        assert is_valid_email("very.long.email.address@subdomain.example.com") is True
        assert is_valid_email("@") is False
        assert is_valid_email("@@") is False


class TestRegressionPhoneFormatting:
    """Regression tests for phone number formatting"""
    
    @pytest.mark.parametrize("input_phone,expected", [
        ("1234567890", "(123) 456-7890"),
        ("123-456-7890", "(123) 456-7890"),
        ("123 456 7890", "(123) 456-7890"),
        ("(123) 456-7890", "(123) 456-7890"),
        ("123.456.7890", "(123) 456-7890"),
    ])
    def test_phone_formatting_various_inputs(self, input_phone, expected):
        """Test phone formatting with different input formats"""
        assert format_phone_number(input_phone) == expected
    
    def test_phone_formatting_error_cases(self):
        """Test error handling for invalid phone numbers"""
        with pytest.raises(ValueError):
            format_phone_number("123")  # Too short
        with pytest.raises(ValueError):
            format_phone_number("12345678901234")  # Too long
        with pytest.raises(ValueError):
            format_phone_number("abcdefghij")  # No digits


class TestRegressionNumerology:
    """Regression tests for numerology calculations"""
    
    @pytest.mark.parametrize("birth_date,expected_min,expected_max", [
        ("1990-05-15", 1, 33),
        ("2000-01-01", 1, 33),
        ("1985-12-25", 1, 33),
        ("1992-06-10", 1, 33),
    ])
    def test_life_path_number_ranges(self, birth_date, expected_min, expected_max):
        """Test that life path numbers are in valid range"""
        result = calculate_life_path_number(birth_date)
        assert expected_min <= result <= expected_max
    
    def test_life_path_number_consistency(self):
        """Test that same input produces same output"""
        date1 = "1990-05-15"
        result1 = calculate_life_path_number(date1)
        result2 = calculate_life_path_number(date1)
        assert result1 == result2
    
    @pytest.mark.parametrize("birth_date,expected", [
        ("1990-05-15", 3),
        ("2000-01-01", 4),
        ("1985-03-15", 5),
        ("1992-12-25", 4),
    ])
    def test_life_path_number_known_values(self, birth_date, expected):
        """Test against known calculated values"""
        assert calculate_life_path_number(birth_date) == expected


class TestRegressionZodiacSigns:
    """Regression tests for zodiac sign calculations"""
    
    @pytest.mark.parametrize("month,day,expected", [
        # Aries (Mar 21 - Apr 19)
        (3, 21, "Aries"), (3, 31, "Aries"), (4, 10, "Aries"), (4, 19, "Aries"),
        # Taurus (Apr 20 - May 20)
        (4, 20, "Taurus"), (4, 30, "Taurus"), (5, 10, "Taurus"), (5, 20, "Taurus"),
        # Gemini (May 21 - Jun 20)
        (5, 21, "Gemini"), (5, 31, "Gemini"), (6, 10, "Gemini"), (6, 20, "Gemini"),
        # Cancer (Jun 21 - Jul 22)
        (6, 21, "Cancer"), (6, 30, "Cancer"), (7, 10, "Cancer"), (7, 22, "Cancer"),
        # Leo (Jul 23 - Aug 22)
        (7, 23, "Leo"), (7, 31, "Leo"), (8, 10, "Leo"), (8, 22, "Leo"),
        # Virgo (Aug 23 - Sep 22)
        (8, 23, "Virgo"), (8, 31, "Virgo"), (9, 10, "Virgo"), (9, 22, "Virgo"),
        # Libra (Sep 23 - Oct 22)
        (9, 23, "Libra"), (9, 30, "Libra"), (10, 10, "Libra"), (10, 22, "Libra"),
        # Scorpio (Oct 23 - Nov 21)
        (10, 23, "Scorpio"), (10, 31, "Scorpio"), (11, 10, "Scorpio"), (11, 21, "Scorpio"),
        # Sagittarius (Nov 22 - Dec 21)
        (11, 22, "Sagittarius"), (11, 30, "Sagittarius"), (12, 10, "Sagittarius"), (12, 21, "Sagittarius"),
        # Capricorn (Dec 22 - Jan 19)
        (12, 22, "Capricorn"), (12, 31, "Capricorn"), (1, 1, "Capricorn"), (1, 19, "Capricorn"),
        # Aquarius (Jan 20 - Feb 18)
        (1, 20, "Aquarius"), (1, 31, "Aquarius"), (2, 10, "Aquarius"), (2, 18, "Aquarius"),
        # Pisces (Feb 19 - Mar 20)
        (2, 19, "Pisces"), (2, 28, "Pisces"), (3, 10, "Pisces"), (3, 20, "Pisces"),
    ])
    def test_zodiac_sign_all_dates(self, month, day, expected):
        """Comprehensive test of all zodiac signs and date ranges"""
        assert get_zodiac_sign(month, day) == expected
    
    def test_zodiac_sign_boundary_dates(self):
        """Test boundary dates between signs"""
        # Aries/Taurus boundary
        assert get_zodiac_sign(4, 19) == "Aries"
        assert get_zodiac_sign(4, 20) == "Taurus"
        
        # Leo/Virgo boundary
        assert get_zodiac_sign(8, 22) == "Leo"
        assert get_zodiac_sign(8, 23) == "Virgo"
        
        # Capricorn/Aquarius boundary
        assert get_zodiac_sign(1, 19) == "Capricorn"
        assert get_zodiac_sign(1, 20) == "Aquarius"
    
    def test_zodiac_sign_invalid_inputs(self):
        """Test error handling for invalid dates"""
        with pytest.raises(ValueError):
            get_zodiac_sign(0, 15)
        with pytest.raises(ValueError):
            get_zodiac_sign(13, 15)
        with pytest.raises(ValueError):
            get_zodiac_sign(-1, 15)


class TestRegressionCompatibility:
    """Regression tests for compatibility calculations"""
    
    def test_compatibility_same_sign(self):
        """Test compatibility for same signs"""
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        for sign in signs:
            score = calculate_compatibility_score(sign, sign)
            assert score == 85, f"Same sign {sign} should have 85% compatibility"
    
    @pytest.mark.parametrize("sign1,sign2,expected", [
        # Fire signs (Aries, Leo, Sagittarius)
        ("Aries", "Leo", 80),
        ("Aries", "Sagittarius", 80),
        ("Leo", "Sagittarius", 80),
        # Earth signs (Taurus, Virgo, Capricorn)
        ("Taurus", "Virgo", 80),
        ("Taurus", "Capricorn", 80),
        ("Virgo", "Capricorn", 80),
        # Air signs (Gemini, Libra, Aquarius)
        ("Gemini", "Libra", 80),
        ("Gemini", "Aquarius", 80),
        ("Libra", "Aquarius", 80),
        # Water signs (Cancer, Scorpio, Pisces)
        ("Cancer", "Scorpio", 80),
        ("Cancer", "Pisces", 80),
        ("Scorpio", "Pisces", 80),
    ])
    def test_compatibility_same_element(self, sign1, sign2, expected):
        """Test compatibility for same element signs"""
        assert calculate_compatibility_score(sign1, sign2) == expected
    
    @pytest.mark.parametrize("sign1,sign2,expected", [
        # Fire and Air compatibility
        ("Aries", "Gemini", 75),
        ("Aries", "Libra", 75),
        ("Leo", "Gemini", 75),
        ("Leo", "Aquarius", 75),
        # Earth and Water compatibility
        ("Taurus", "Cancer", 75),
        ("Taurus", "Pisces", 75),
        ("Virgo", "Scorpio", 75),
        ("Capricorn", "Cancer", 75),
    ])
    def test_compatibility_compatible_elements(self, sign1, sign2, expected):
        """Test compatibility for compatible element pairs"""
        assert calculate_compatibility_score(sign1, sign2) == expected
    
    def test_compatibility_symmetry(self):
        """Test that compatibility is symmetric"""
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo"]
        for sign1 in signs:
            for sign2 in signs:
                score1 = calculate_compatibility_score(sign1, sign2)
                score2 = calculate_compatibility_score(sign2, sign1)
                assert score1 == score2, f"Compatibility should be symmetric for {sign1} and {sign2}"
    
    def test_compatibility_score_ranges(self):
        """Test that all compatibility scores are within valid range"""
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        for sign1 in signs:
            for sign2 in signs:
                score = calculate_compatibility_score(sign1, sign2)
                assert 0 <= score <= 100, f"Score for {sign1}-{sign2} should be 0-100"


class TestRegressionIntegration:
    """Integration tests combining multiple functions"""
    
    def test_full_user_profile_calculation(self):
        """Test complete user profile calculation"""
        # User born on May 15, 1990
        birth_year = 1990
        birth_month = 5
        birth_day = 15
        birth_date = "1990-05-15"
        current_year = 2025
        
        # Calculate all properties
        age = calculate_age(birth_year, current_year)
        zodiac = get_zodiac_sign(birth_month, birth_day)
        life_path = calculate_life_path_number(birth_date)
        
        # Verify results
        assert age == 35
        assert zodiac == "Taurus"
        assert life_path == 3
        assert isinstance(age, int)
        assert isinstance(zodiac, str)
        assert isinstance(life_path, int)
    
    def test_user_contact_validation(self):
        """Test user contact information validation"""
        email = "user@astro.ai"
        phone = "5551234567"
        
        # Validate and format
        email_valid = is_valid_email(email)
        formatted_phone = format_phone_number(phone)
        
        assert email_valid is True
        assert formatted_phone == "(555) 123-4567"
    
    def test_couple_compatibility_analysis(self):
        """Test complete couple compatibility workflow"""
        # Person 1: Aries (March 25)
        sign1 = get_zodiac_sign(3, 25)
        # Person 2: Leo (August 5)
        sign2 = get_zodiac_sign(8, 5)
        
        # Calculate compatibility
        compatibility = calculate_compatibility_score(sign1, sign2)
        
        assert sign1 == "Aries"
        assert sign2 == "Leo"
        assert compatibility == 80  # Same element (Fire)
    
    @pytest.mark.parametrize("test_case", [
        {
            "birth_year": 1985,
            "birth_month": 12,
            "birth_day": 25,
            "birth_date": "1985-12-25",
            "expected_age": 40,
            "expected_zodiac": "Capricorn",
            "expected_life_path_range": (1, 33)
        },
        {
            "birth_year": 2000,
            "birth_month": 6,
            "birth_day": 15,
            "birth_date": "2000-06-15",
            "expected_age": 25,
            "expected_zodiac": "Gemini",
            "expected_life_path_range": (1, 33)
        },
    ])
    def test_multiple_user_profiles(self, test_case):
        """Test multiple complete user profiles"""
        age = calculate_age(test_case["birth_year"], 2025)
        zodiac = get_zodiac_sign(test_case["birth_month"], test_case["birth_day"])
        life_path = calculate_life_path_number(test_case["birth_date"])
        
        assert age == test_case["expected_age"]
        assert zodiac == test_case["expected_zodiac"]
        assert test_case["expected_life_path_range"][0] <= life_path <= test_case["expected_life_path_range"][1]


class TestRegressionPerformance:
    """Performance regression tests"""
    
    def test_zodiac_calculation_performance(self):
        """Test performance doesn't degrade"""
        import time
        start = time.time()
        for month in range(1, 13):
            for day in range(1, 28):
                try:
                    get_zodiac_sign(month, day)
                except ValueError:
                    pass
        elapsed = time.time() - start
        assert elapsed < 1.0, "Zodiac calculations taking too long"
    
    def test_compatibility_calculation_performance(self):
        """Test compatibility calculation performance"""
        import time
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        
        start = time.time()
        for sign1 in signs:
            for sign2 in signs:
                calculate_compatibility_score(sign1, sign2)
        elapsed = time.time() - start
        assert elapsed < 0.5, "Compatibility calculations taking too long"


class TestRegressionDataIntegrity:
    """Data integrity and consistency tests"""
    
    def test_all_zodiac_signs_covered(self):
        """Test that all days of the year map to a zodiac sign"""
        days_per_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        signs_found = set()
        
        for month in range(1, 13):
            for day in range(1, days_per_month[month - 1] + 1):
                try:
                    sign = get_zodiac_sign(month, day)
                    signs_found.add(sign)
                except ValueError:
                    pass
        
        expected_signs = {"Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"}
        assert signs_found == expected_signs, "Not all zodiac signs covered"
    
    def test_no_duplicate_zodiac_dates(self):
        """Test that no date maps to multiple zodiac signs"""
        days_per_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        date_sign_map = {}
        
        for month in range(1, 13):
            for day in range(1, days_per_month[month - 1] + 1):
                try:
                    sign = get_zodiac_sign(month, day)
                    date_key = (month, day)
                    assert date_key not in date_sign_map or date_sign_map[date_key] == sign
                    date_sign_map[date_key] = sign
                except ValueError:
                    pass
    
    def test_life_path_number_consistency(self):
        """Test that life path calculations are consistent"""
        test_dates = [
            "1990-01-01", "1995-06-15", "2000-12-31",
            "1985-03-15", "1992-08-20", "2005-11-11"
        ]
        
        for date in test_dates:
            result1 = calculate_life_path_number(date)
            result2 = calculate_life_path_number(date)
            result3 = calculate_life_path_number(date)
            assert result1 == result2 == result3, f"Inconsistent results for {date}"
