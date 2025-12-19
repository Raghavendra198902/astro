"""
Unit tests for authentication and authorization
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.core.config import get_settings
from app.models.models import UserRole


class TestPasswordHashing:
    """Test password hashing and verification"""
    
    def test_hash_password(self):
        """Test password hashing"""
        password = "SecurePassword123!"
        hashed = hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 0
        assert hashed.startswith("$argon2")
    
    def test_verify_password_correct(self):
        """Test password verification with correct password"""
        password = "SecurePassword123!"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password"""
        password = "SecurePassword123!"
        hashed = hash_password(password)
        
        assert verify_password("WrongPassword456!", hashed) is False
    
    def test_same_password_different_hashes(self):
        """Test that same password produces different hashes (due to salt)"""
        password = "SecurePassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        assert hash1 != hash2
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


class TestJWTTokens:
    """Test JWT token creation and verification"""
    
    def test_create_access_token(self):
        """Test access token creation"""
        data = {"sub": "user123", "role": "seeker"}
        token = create_access_token(data=data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Decode and verify
        settings = get_settings()
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        assert payload["sub"] == "user123"
        assert payload["role"] == "seeker"
        assert "exp" in payload
    
    def test_create_access_token_with_expiry(self):
        """Test access token with custom expiry"""
        data = {"sub": "user123"}
        expires_delta = timedelta(minutes=15)
        token = create_access_token(data=data, expires_delta=expires_delta)
        
        settings = get_settings()
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        now = datetime.utcnow()
        
        # Should expire in approximately 15 minutes
        diff_minutes = (exp_datetime - now).total_seconds() / 60
        assert 14 <= diff_minutes <= 16
    
    def test_create_refresh_token(self):
        """Test refresh token creation"""
        data = {"sub": "user123"}
        token = create_refresh_token(data=data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        settings = get_settings()
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        assert payload["sub"] == "user123"
        assert "exp" in payload
    
    def test_verify_token_valid(self):
        """Test token verification with valid token"""
        data = {"sub": "user123", "role": "seeker"}
        token = create_access_token(data=data)
        
        payload = verify_token(token)
        
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["role"] == "seeker"
    
    def test_verify_token_expired(self):
        """Test token verification with expired token"""
        data = {"sub": "user123"}
        expires_delta = timedelta(seconds=-1)  # Already expired
        token = create_access_token(data=data, expires_delta=expires_delta)
        
        payload = verify_token(token)
        assert payload is None
    
    def test_verify_token_invalid(self):
        """Test token verification with invalid token"""
        invalid_token = "invalid.token.here"
        
        payload = verify_token(invalid_token)
        assert payload is None
    
    def test_verify_token_tampered(self):
        """Test token verification with tampered token"""
        data = {"sub": "user123"}
        token = create_access_token(data=data)
        
        # Tamper with the token
        parts = token.split(".")
        parts[1] = parts[1][:-5] + "xxxxx"
        tampered_token = ".".join(parts)
        
        payload = verify_token(tampered_token)
        assert payload is None


@pytest.mark.asyncio
class TestAuthenticationEndpoints:
    """Test authentication API endpoints"""
    
    async def test_register_success(self, client):
        """Test successful user registration"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "role": "seeker",
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["role"] == "seeker"
        assert "id" in data
        assert "hashed_password" not in data
    
    async def test_register_duplicate_email(self, client, test_user):
        """Test registration with duplicate email"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": test_user.email,
                "password": "AnotherPass123!",
                "role": "seeker",
            }
        )
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    async def test_register_invalid_email(self, client):
        """Test registration with invalid email"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "not-an-email",
                "password": "SecurePass123!",
                "role": "seeker",
            }
        )
        
        assert response.status_code == 422
    
    async def test_register_weak_password(self, client):
        """Test registration with weak password"""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "weak",
                "role": "seeker",
            }
        )
        
        assert response.status_code == 422
    
    async def test_login_success(self, client, test_user):
        """Test successful login"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "testpassword123",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_wrong_password(self, client, test_user):
        """Test login with wrong password"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "wrongpassword",
            }
        )
        
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    async def test_login_nonexistent_user(self, client):
        """Test login with non-existent user"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "somepassword",
            }
        )
        
        assert response.status_code == 401
    
    async def test_get_current_user(self, client, test_user, auth_headers):
        """Test getting current user info"""
        response = await client.get(
            "/api/v1/auth/me",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["id"] == str(test_user.id)
    
    async def test_get_current_user_no_auth(self, client):
        """Test getting current user without authentication"""
        response = await client.get("/api/v1/auth/me")
        
        assert response.status_code == 401
    
    async def test_refresh_token(self, client, test_user):
        """Test token refresh"""
        # First login
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "testpassword123",
            }
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


class TestRoleBasedAccess:
    """Test role-based access control"""
    
    @pytest.mark.asyncio
    async def test_seeker_access(self, client, auth_headers):
        """Test seeker role access"""
        response = await client.get(
            "/api/v1/charts",
            headers=auth_headers
        )
        # Should have access to charts
        assert response.status_code in [200, 404]  # 404 if no charts exist
    
    @pytest.mark.asyncio
    async def test_astrologer_access(self, client, astrologer_auth_headers):
        """Test astrologer role access"""
        response = await client.get(
            "/api/v1/consultations/schedule",
            headers=astrologer_auth_headers
        )
        # Should have access to consultations
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_admin_access(self, client, admin_auth_headers):
        """Test admin role access"""
        response = await client.get(
            "/api/v1/users",
            headers=admin_auth_headers
        )
        # Should have access to user management
        assert response.status_code in [200, 404]
