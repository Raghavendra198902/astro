"""Utility functions for testing - simple, no external dependencies"""


def calculate_age(birth_year: int, current_year: int) -> int:
    """Calculate age from birth year"""
    if birth_year > current_year:
        raise ValueError("Birth year cannot be in the future")
    return current_year - birth_year


def is_valid_email(email: str) -> bool:
    """Simple email validation"""
    if not email or '@' not in email:
        return False
    
    # Check for spaces (not allowed in email addresses)
    if ' ' in email:
        return False
    
    parts = email.split('@')
    if len(parts) != 2:
        return False
    
    username, domain = parts
    if not username or not domain:
        return False
    
    if '.' not in domain:
        return False
    
    return True


def format_phone_number(phone: str) -> str:
    """Format phone number to (XXX) XXX-XXXX"""
    # Remove all non-digit characters
    digits = ''.join(c for c in phone if c.isdigit())
    
    if len(digits) != 10:
        raise ValueError("Phone number must have exactly 10 digits")
    
    return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"


def calculate_life_path_number(birth_date: str) -> int:
    """Calculate numerology life path number from date (YYYY-MM-DD)"""
    # Remove dashes and sum all digits
    digits = [int(d) for d in birth_date if d.isdigit()]
    total = sum(digits)
    
    # Reduce to single digit (except master numbers 11, 22, 33)
    while total > 9 and total not in [11, 22, 33]:
        total = sum(int(d) for d in str(total))
    
    return total


def get_zodiac_sign(month: int, day: int) -> str:
    """Get Western zodiac sign from birth date"""
    if month == 1:
        return "Capricorn" if day <= 19 else "Aquarius"
    elif month == 2:
        return "Aquarius" if day <= 18 else "Pisces"
    elif month == 3:
        return "Pisces" if day <= 20 else "Aries"
    elif month == 4:
        return "Aries" if day <= 19 else "Taurus"
    elif month == 5:
        return "Taurus" if day <= 20 else "Gemini"
    elif month == 6:
        return "Gemini" if day <= 20 else "Cancer"
    elif month == 7:
        return "Cancer" if day <= 22 else "Leo"
    elif month == 8:
        return "Leo" if day <= 22 else "Virgo"
    elif month == 9:
        return "Virgo" if day <= 22 else "Libra"
    elif month == 10:
        return "Libra" if day <= 22 else "Scorpio"
    elif month == 11:
        return "Scorpio" if day <= 21 else "Sagittarius"
    elif month == 12:
        return "Sagittarius" if day <= 21 else "Capricorn"
    else:
        raise ValueError("Invalid month")


def calculate_compatibility_score(sign1: str, sign2: str) -> int:
    """Calculate basic compatibility score between zodiac signs (0-100)"""
    fire_signs = ["Aries", "Leo", "Sagittarius"]
    earth_signs = ["Taurus", "Virgo", "Capricorn"]
    air_signs = ["Gemini", "Libra", "Aquarius"]
    water_signs = ["Cancer", "Scorpio", "Pisces"]
    
    # Same sign
    if sign1 == sign2:
        return 85
    
    # Find element groups
    sign1_element = None
    sign2_element = None
    
    for element, signs in [("fire", fire_signs), ("earth", earth_signs), 
                           ("air", air_signs), ("water", water_signs)]:
        if sign1 in signs:
            sign1_element = element
        if sign2 in signs:
            sign2_element = element
    
    # Same element
    if sign1_element == sign2_element:
        return 80
    
    # Compatible elements
    compatible = [
        ("fire", "air"), ("air", "fire"),
        ("earth", "water"), ("water", "earth")
    ]
    
    if (sign1_element, sign2_element) in compatible:
        return 75
    
    # Neutral compatibility
    return 60
