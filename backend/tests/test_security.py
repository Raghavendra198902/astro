"""Test security utilities with actual code coverage"""

import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from datetime import timedelta


def test_password_hashing():
    """Test password hashing"""
    password = "TestPassword123!"
    hashed = get_password_hash(password)
    
    # Hash should be different from original
    assert hashed != password
    
    # Hash should be long enough (bcrypt/argon2)
    assert len(hashed) > 50
    
    # Same password should verify
    assert verify_password(password, hashed) is True
    
    # Different password should not verify
    assert verify_password("WrongPassword", hashed) is False


def test_password_hashing_different_salts():
    """Test that same password produces different hashes"""
    password = "TestPassword123!"
    hash1 = get_password_hash(password)
    hash2 = get_password_hash(password)
    
    # Different salts should produce different hashes
    assert hash1 != hash2
    
    # But both should verify the original password
    assert verify_password(password, hash1) is True
    assert verify_password(password, hash2) is True


def test_jwt_token_creation():
    """Test JWT token creation"""
    user_data = {"sub": "user123", "email": "test@example.com"}
    token = create_access_token(user_data)
    
    # Token should be a non-empty string
    assert isinstance(token, str)
    assert len(token) > 0
    
    # Token should have 3 parts (header.payload.signature)
    assert token.count('.') == 2


def test_jwt_token_decode():
    """Test JWT token decoding"""
    user_data = {"sub": "user123", "email": "test@example.com", "role": "user"}
    token = create_access_token(user_data)
    
    # Decode token
    decoded = decode_access_token(token)
    
    # Verify data is preserved
    assert decoded is not None
    assert decoded.get("sub") == "user123"
    assert decoded.get("email") == "test@example.com"
    assert decoded.get("role") == "user"


def test_jwt_token_with_expiration():
    """Test JWT token with custom expiration"""
    user_data = {"sub": "user456"}
    token = create_access_token(user_data, expires_delta=timedelta(minutes=15))
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded.get("sub") == "user456"
    
    # Token should have 'exp' claim
    assert "exp" in decoded


def test_invalid_token_decode():
    """Test decoding invalid tokens"""
    # Invalid token should return None
    assert decode_access_token("invalid.token.here") is None
    assert decode_access_token("") is None
    assert decode_access_token("not-a-jwt") is None


@pytest.mark.parametrize("password", [
    "SimplePass123",
    "Complex!@#$%Pass123",
    "LongPasswordWithManyCharacters12345!@#",
    "Short1!",
    "unicode密码123",
])
def test_password_hashing_various_formats(password):
    """Test password hashing with various formats"""
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password(password + "x", hashed) is False
