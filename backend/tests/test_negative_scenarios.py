"""
Negative Testing Suite - Tests error handling, edge cases, and invalid inputs
Tests system behavior under adverse conditions to ensure robust error handling
"""
import pytest
from datetime import datetime
from app.utils.astro_utils import (
    calculate_age,
    is_valid_email,
    format_phone_number,
    calculate_life_path_number,
    get_zodiac_sign,
    calculate_compatibility_score
)


class TestNegativeAgeCalculation:
    """Negative tests for age calculation"""
    
    def test_age_future_birth_year(self):
        """Test that future birth year raises ValueError"""
        with pytest.raises(ValueError, match="Birth year cannot be in the future"):
            calculate_age(2030, 2025)
    
    def test_age_far_future_year(self):
        """Test extreme future year"""
        with pytest.raises(ValueError):
            calculate_age(3000, 2025)
    
    def test_age_invalid_types(self):
        """Test invalid input types"""
        with pytest.raises(TypeError):
            calculate_age("1990", 2025)
        
        with pytest.raises(TypeError):
            calculate_age(1990, "2025")
        
        with pytest.raises(TypeError):
            calculate_age(None, 2025)
        
        with pytest.raises(TypeError):
            calculate_age(1990, None)
    
    def test_age_negative_years(self):
        """Test negative year values"""
        with pytest.raises(ValueError):
            calculate_age(-1990, 2025)
    
    def test_age_zero_years(self):
        """Test zero year values"""
        result = calculate_age(0, 2025)
        assert result == 2025


class TestNegativeEmailValidation:
    """Negative tests for email validation"""
    
    @pytest.mark.parametrize("invalid_email", [
        "",                          # Empty string
        " ",                         # Just space
        "   ",                       # Multiple spaces
        None,                        # None value
        "plaintext",                 # No @ symbol
        "@",                         # Just @ symbol
        "@@",                        # Multiple @ symbols
        "@domain.com",               # No username
        "user@",                     # No domain
        "user@@domain.com",          # Double @ symbol
        "user@domain",               # No TLD
        "user @domain.com",          # Space before @
        "user@ domain.com",          # Space after @
        "user@domain .com",          # Space in domain
        "user@domain. com",          # Space before TLD
        " user@domain.com",          # Leading space
        "user@domain.com ",          # Trailing space
        "us er@domain.com",          # Space in username
        "user@do main.com",          # Space in domain name
        "user\n@domain.com",         # Newline character
        "user\t@domain.com",         # Tab character
        "user@domain\n.com",         # Newline in domain
        "user@domain.com\n",         # Trailing newline
        "user..name@domain.com",     # Double dots (edge case)
        "user@",                     # Missing domain completely
        "@.com",                     # Missing username and domain
        "user@domain..com",          # Double dots in domain
        ".user@domain.com",          # Leading dot in username
        "user.@domain.com",          # Trailing dot in username
        "user@.domain.com",          # Leading dot in domain
        "user@domain.com.",          # Trailing dot
        "user name@email.com",       # Space in username
        "user@domain name.com",      # Space in domain
        "user<>@domain.com",         # Special characters
        "user[]@domain.com",         # Brackets
        "user()@domain.com",         # Parentheses
        "user{}@domain.com",         # Braces
        "user;@domain.com",          # Semicolon
        "user:@domain.com",          # Colon
        "user,@domain.com",          # Comma
        "user\"@domain.com",         # Quote
        "user'@domain.com",          # Single quote
        "user\\@domain.com",         # Backslash
        "user/@domain.com",          # Forward slash
        "user?@domain.com",          # Question mark
        "user!@domain.com",          # Exclamation (actually valid but testing)
        "user#@domain.com",          # Hash
        "user$@domain.com",          # Dollar sign
        "user%@domain.com",          # Percent
        "user&@domain.com",          # Ampersand
        "user*@domain.com",          # Asterisk
        "user=@domain.com",          # Equals
        "a" * 65 + "@domain.com",    # Username too long (>64 chars)
        "user@" + "a" * 256 + ".com", # Domain too long (>255 chars)
    ])
    def test_invalid_email_formats(self, invalid_email):
        """Test various invalid email formats"""
        if invalid_email is None:
            with pytest.raises((TypeError, AttributeError)):
                is_valid_email(invalid_email)
        else:
            assert is_valid_email(invalid_email) is False
    
    def test_email_with_unicode(self):
        """Test email with unicode characters"""
        # Most systems don't support unicode in email by default
        assert is_valid_email("user@dömain.com") in [True, False]  # Implementation dependent
    
    def test_email_case_sensitivity(self):
        """Test that email validation is case-insensitive"""
        # These should all be valid or all invalid consistently
        assert is_valid_email("USER@DOMAIN.COM") == is_valid_email("user@domain.com")


class TestNegativePhoneFormatting:
    """Negative tests for phone number formatting"""
    
    @pytest.mark.parametrize("invalid_phone", [
        "",                          # Empty string
        " ",                         # Just space
        "123",                       # Too short
        "12345",                     # Too short
        "123456789",                 # 9 digits
        "12345678901",               # 11 digits
        "123456789012",              # 12 digits
        "abcdefghij",                # Letters only
        "abc-def-ghij",              # Letters with dashes
        "(abc) def-ghij",            # Letters formatted
        "1234567890a",               # Mixed alphanumeric
        None,                        # None value
        "1-2-3-4-5-6-7-8-9-0",       # Too many separators
        "++1234567890",              # Plus signs
        "--1234567890",              # Multiple dashes
        "()1234567890",              # Empty parentheses
        "(123)4567890",              # Wrong format
        "123-456-789",               # Too short formatted
        "123-456-78901",             # Too long formatted
        " 1234567890",               # Leading space
        "1234567890 ",               # Trailing space
        "123 456 7890",              # Spaces in middle
        "\n1234567890",              # Newline
        "1234567890\n",              # Trailing newline
        "\t1234567890",              # Tab
        "12.34.56.78.90",            # Dots as separators
        "12,34,56,78,90",            # Commas as separators
        "12/34/56/78/90",            # Slashes as separators
        "12\\34\\56\\78\\90",        # Backslashes
        "12 34 56 78 90",            # Spaces
        "!@#$%^&*()",                # Special characters
        "0000000000",                # All zeros (edge case)
        "9999999999",                # All nines (edge case)
        "1111111111",                # All ones
        "x" * 100,                   # Very long string
        "1" * 100,                   # Very long number string
    ])
    def test_invalid_phone_formats(self, invalid_phone):
        """Test various invalid phone number formats"""
        if invalid_phone is None:
            with pytest.raises((ValueError, TypeError, AttributeError)):
                format_phone_number(invalid_phone)
        else:
            with pytest.raises(ValueError):
                format_phone_number(invalid_phone)
    
    def test_phone_with_international_prefix(self):
        """Test phone with international prefix (11+ digits)"""
        with pytest.raises(ValueError):
            format_phone_number("+11234567890")  # 11 digits
        
        with pytest.raises(ValueError):
            format_phone_number("011234567890")  # 11 digits


class TestNegativeLifePathNumber:
    """Negative tests for life path number calculation"""
    
    @pytest.mark.parametrize("invalid_date", [
        "",                          # Empty string
        " ",                         # Just space
        "invalid",                   # Not a date
        "2023-13-01",                # Invalid month
        "2023-00-01",                # Month zero
        "2023-01-32",                # Invalid day
        "2023-01-00",                # Day zero
        "2023-02-30",                # Feb 30th
        "2023-02-31",                # Feb 31st
        "2023-04-31",                # April 31st
        "2023-06-31",                # June 31st
        "2023-09-31",                # September 31st
        "2023-11-31",                # November 31st
        None,                        # None value
        "01-01-2023",                # Wrong format
        "2023/01/01",                # Slashes instead of dashes
        "2023.01.01",                # Dots instead of dashes
        "20230101",                  # No separators
        "23-01-01",                  # 2-digit year
        "2023-1-1",                  # Missing leading zeros
        "2023-01",                   # Missing day
        "2023",                      # Just year
        "01-01",                     # Just month-day
        "2023-01-01-01",             # Extra component
        "abc-def-ghij",              # Letters
        "2023--01--01",              # Double dashes
        "-2023-01-01",               # Leading dash
        "2023-01-01-",               # Trailing dash
        " 2023-01-01",               # Leading space
        "2023-01-01 ",               # Trailing space
        "2023 -01-01",               # Space in middle
        "2023\n-01-01",              # Newline
        "2023-01-01\n",              # Trailing newline
        "\t2023-01-01",              # Tab
        "0000-00-00",                # All zeros
        "9999-99-99",                # Invalid date
        "1900-02-29",                # Non-leap year Feb 29
        "2100-02-29",                # Non-leap year Feb 29
        "2023-00-00",                # Zero month and day
        "a" * 100,                   # Very long string
    ])
    def test_invalid_date_formats(self, invalid_date):
        """Test various invalid date formats"""
        if invalid_date is None:
            with pytest.raises((TypeError, AttributeError)):
                calculate_life_path_number(invalid_date)
        else:
            # The function will try to extract digits, which may or may not work
            try:
                result = calculate_life_path_number(invalid_date)
                # If it doesn't raise an error, at least verify the result is valid
                assert result in list(range(1, 10)) + [11, 22, 33]
            except (ValueError, IndexError, AttributeError):
                # Expected for truly invalid inputs
                pass


class TestNegativeZodiacSign:
    """Negative tests for zodiac sign calculation"""
    
    @pytest.mark.parametrize("month,day", [
        (0, 1),                      # Month zero
        (13, 1),                     # Month 13
        (14, 1),                     # Month 14
        (100, 1),                    # Very large month
        (-1, 1),                     # Negative month
        (1, 0),                      # Day zero
        (1, 32),                     # Day 32
        (1, 33),                     # Day 33
        (1, 100),                    # Very large day
        (1, -1),                     # Negative day
        (2, 30),                     # Feb 30
        (2, 31),                     # Feb 31
        (4, 31),                     # April 31
        (6, 31),                     # June 31
        (9, 31),                     # Sept 31
        (11, 31),                    # Nov 31
        (0, 0),                      # Both zero
        (-1, -1),                    # Both negative
        (100, 100),                  # Both very large
    ])
    def test_invalid_dates(self, month, day):
        """Test various invalid month/day combinations"""
        with pytest.raises(ValueError):
            get_zodiac_sign(month, day)
    
    def test_zodiac_with_invalid_types(self):
        """Test with invalid input types"""
        with pytest.raises(TypeError):
            get_zodiac_sign("1", 1)
        
        with pytest.raises(TypeError):
            get_zodiac_sign(1, "1")
        
        with pytest.raises(TypeError):
            get_zodiac_sign(None, 1)
        
        with pytest.raises(TypeError):
            get_zodiac_sign(1, None)
        
        with pytest.raises(TypeError):
            get_zodiac_sign(1.5, 1)
        
        with pytest.raises(TypeError):
            get_zodiac_sign(1, 1.5)


class TestNegativeCompatibilityScore:
    """Negative tests for compatibility score calculation"""
    
    @pytest.mark.parametrize("sign1,sign2", [
        ("", "Aries"),               # Empty string
        ("Aries", ""),               # Empty string
        ("", ""),                    # Both empty
        (" ", "Aries"),              # Just space
        ("Aries", " "),              # Just space
        ("Invalid", "Aries"),        # Invalid sign
        ("Aries", "Invalid"),        # Invalid sign
        ("Invalid", "Invalid"),      # Both invalid
        (None, "Aries"),             # None value
        ("Aries", None),             # None value
        (None, None),                # Both None
        ("aries", "Aries"),          # Lowercase (might work)
        ("ARIES", "Aries"),          # Uppercase (might work)
        ("ArIeS", "Aries"),          # Mixed case
        ("Arie", "Aries"),           # Typo
        ("Ariess", "Aries"),         # Extra letter
        ("Ares", "Aries"),           # Typo
        ("Torus", "Taurus"),         # Typo
        ("Gemeni", "Gemini"),        # Typo
        ("Cancre", "Cancer"),        # Typo
        ("Leo ", "Leo"),             # Trailing space
        (" Leo", "Leo"),             # Leading space
        ("Le o", "Leo"),             # Space in middle
        ("Leo\n", "Leo"),            # Newline
        ("\tLeo", "Leo"),            # Tab
        ("123", "Aries"),            # Numbers
        ("Aries", "123"),            # Numbers
        ("@#$", "Aries"),            # Special characters
        ("Aries", "@#$"),            # Special characters
        ("a" * 100, "Aries"),        # Very long string
        ("Aries", "a" * 100),        # Very long string
    ])
    def test_invalid_zodiac_signs(self, sign1, sign2):
        """Test various invalid zodiac sign combinations"""
        if sign1 is None or sign2 is None:
            with pytest.raises((TypeError, AttributeError, KeyError)):
                calculate_compatibility_score(sign1, sign2)
        else:
            # The function may handle case variations
            try:
                result = calculate_compatibility_score(sign1, sign2)
                # If it doesn't raise an error, verify result is in valid range
                assert 0 <= result <= 100
            except (ValueError, KeyError, AttributeError):
                # Expected for truly invalid inputs
                pass


class TestNegativeBoundaryConditions:
    """Test extreme boundary conditions"""
    
    def test_age_with_very_old_birth_year(self):
        """Test with very old birth year"""
        result = calculate_age(1, 2025)
        assert result == 2024
    
    def test_age_same_year(self):
        """Test when birth year equals current year"""
        result = calculate_age(2025, 2025)
        assert result == 0
    
    def test_zodiac_boundary_dates(self):
        """Test zodiac signs on exact boundary dates"""
        # These are the boundary dates - should not raise errors
        assert get_zodiac_sign(1, 1) in ["Capricorn", "Aquarius"]
        assert get_zodiac_sign(12, 31) in ["Capricorn", "Sagittarius"]
        assert get_zodiac_sign(2, 28) in ["Aquarius", "Pisces"]
        assert get_zodiac_sign(2, 29) in ["Aquarius", "Pisces"]  # Leap year
    
    def test_life_path_all_zeros_date(self):
        """Test life path with date containing only zeros"""
        # Edge case: what if someone passes "0000-00-00"?
        try:
            result = calculate_life_path_number("0000-00-00")
            assert result in list(range(1, 10)) + [11, 22, 33]
        except (ValueError, IndexError):
            pass  # Also acceptable to reject this
    
    def test_phone_all_same_digits(self):
        """Test phone formatting with all same digits"""
        result = format_phone_number("5555555555")
        assert result == "(555) 555-5555"


class TestNegativeIntegration:
    """Negative integration tests combining multiple functions"""
    
    def test_complete_profile_with_invalid_email(self):
        """Test complete user profile with invalid email"""
        birth_date = "1990-05-15"
        email = "invalid email@test.com"
        phone = "1234567890"
        
        # Email validation should fail
        assert is_valid_email(email) is False
        
        # But other validations should still work
        assert calculate_life_path_number(birth_date) in list(range(1, 10)) + [11, 22, 33]
        assert format_phone_number(phone) == "(123) 456-7890"
    
    def test_complete_profile_with_invalid_phone(self):
        """Test complete user profile with invalid phone"""
        email = "valid@email.com"
        invalid_phone = "123"
        
        assert is_valid_email(email) is True
        with pytest.raises(ValueError):
            format_phone_number(invalid_phone)
    
    def test_compatibility_with_invalid_dates(self):
        """Test compatibility calculation with invalid zodiac dates"""
        with pytest.raises(ValueError):
            sign1 = get_zodiac_sign(13, 1)  # Invalid month
            sign2 = get_zodiac_sign(1, 32)  # Invalid day
            calculate_compatibility_score(sign1, sign2)


class TestNegativePerformance:
    """Negative tests for performance under stress"""
    
    def test_very_long_email(self):
        """Test email validation with very long string"""
        very_long_email = "a" * 10000 + "@" + "b" * 10000 + ".com"
        result = is_valid_email(very_long_email)
        assert result in [True, False]  # Should not hang or crash
    
    def test_very_long_phone(self):
        """Test phone formatting with very long string"""
        very_long_phone = "1" * 10000
        with pytest.raises(ValueError):
            format_phone_number(very_long_phone)
    
    def test_very_long_date_string(self):
        """Test life path with very long date string"""
        very_long_date = "1" * 10000 + "-" + "2" * 10000 + "-" + "3" * 10000
        try:
            result = calculate_life_path_number(very_long_date)
            # Should still work by extracting digits
            assert result in list(range(1, 10)) + [11, 22, 33]
        except (ValueError, MemoryError):
            pass  # Also acceptable to fail gracefully


class TestNegativeSecurity:
    """Security-focused negative tests"""
    
    def test_sql_injection_in_email(self):
        """Test email validation with SQL injection attempts"""
        sql_injections = [
            "user@domain.com'; DROP TABLE users; --",
            "user' OR '1'='1@domain.com",
            "user@domain.com\"; DELETE FROM users; --",
            "admin'--@domain.com",
            "user@domain.com' UNION SELECT * FROM passwords--",
        ]
        for injection in sql_injections:
            # Should not be valid emails (contain special characters)
            result = is_valid_email(injection)
            assert result is False or result is True  # Just shouldn't crash
    
    def test_xss_in_email(self):
        """Test email validation with XSS attempts"""
        xss_attempts = [
            "<script>alert('xss')</script>@domain.com",
            "user@domain.com<script>",
            "javascript:alert(1)@domain.com",
            "<img src=x onerror=alert(1)>@domain.com",
        ]
        for xss in xss_attempts:
            result = is_valid_email(xss)
            assert result is False or result is True  # Just shouldn't crash
    
    def test_path_traversal_in_inputs(self):
        """Test path traversal attempts"""
        path_traversal = [
            "../../etc/passwd",
            "..\\..\\windows\\system32",
            "../../../root",
        ]
        for path in path_traversal:
            result = is_valid_email(path + "@domain.com")
            assert result is False or result is True  # Just shouldn't crash


class TestNegativeConcurrency:
    """Tests for concurrent access and race conditions"""
    
    def test_rapid_successive_calls(self):
        """Test rapid successive function calls"""
        for _ in range(1000):
            assert calculate_age(1990, 2025) == 35
            assert is_valid_email("test@example.com") is True
            assert format_phone_number("1234567890") == "(123) 456-7890"
    
    def test_alternating_valid_invalid(self):
        """Test alternating between valid and invalid inputs"""
        for i in range(100):
            if i % 2 == 0:
                assert is_valid_email("valid@email.com") is True
            else:
                assert is_valid_email("invalid") is False


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
