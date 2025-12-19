"""
Authentication Endpoints
Registration, login, token refresh, OAuth
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.config import Settings, get_settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_active_user
)
from app.models.models import User, UserRole, Profile, TOBAccuracy, ChartSystem
from app.schemas.schemas import (
    UserRegister,
    Token,
    UserResponse
)
from datetime import datetime
import pytz
import secrets
import httpx

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register new user"""
    # Check if email exists
    stmt = select(User).where(User.email == user_data.email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        role=UserRole.SEEKER  # Use enum which has lowercase value
    )
    
    db.add(user)
    await db.flush()  # Get user.id before creating profile
    
    # Auto-create default profile for the user
    # This enables chart generation immediately after registration
    default_profile = Profile(
        user_id=user.id,
        name=user_data.full_name,
        dob_ts_utc=datetime(1990, 1, 1, 12, 0, 0, tzinfo=pytz.UTC),  # Placeholder DOB
        tob_accuracy=TOBAccuracy.UNKNOWN.value,
        birthplace_text="Not Set",
        latitude=0.0,  # Placeholder
        longitude=0.0,  # Placeholder
        timezone="UTC",
        preferred_system=ChartSystem.VEDIC.value,
        language="en"
    )
    
    db.add(default_profile)
    await db.commit()
    await db.refresh(user)
    
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """User login"""
    # Get user by email
    stmt = select(User).where(User.email == form_data.username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account disabled"
        )
    
    # Create tokens
    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})
    
    # Update last login
    from datetime import datetime
    user.last_login = datetime.utcnow()
    await db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token"""
    # Verify and decode refresh token
    from app.core.security import decode_token
    
    try:
        payload = decode_token(refresh_token)
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalars().first()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new tokens
        new_access_token = create_access_token({"sub": user.email})
        new_refresh_token = create_refresh_token({"sub": user.email})
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return current_user


# OAuth state storage (in production, use Redis)
oauth_states = {}


@router.get("/google/login")
async def google_login(request: Request, settings: Settings = Depends(get_settings)):
    """Initiate Google OAuth login"""
    # Generate state token for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = {"provider": "google", "timestamp": datetime.utcnow()}
    
    # Google OAuth configuration
    client_id = settings.GOOGLE_CLIENT_ID
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    scope = "openid email profile"
    
    # Build authorization URL
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope={scope}&"
        f"state={state}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    settings: Settings = Depends(get_settings)
):
    """Handle Google OAuth callback"""
    # Verify state
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Clean up state
    del oauth_states[state]
    
    # Exchange code for tokens
    client_id = settings.GOOGLE_CLIENT_ID
    client_secret = settings.GOOGLE_CLIENT_SECRET
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            }
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        # Get user info from Google
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_info = user_response.json()
    
    # Find or create user
    email = user_info.get("email")
    name = user_info.get("name", "")
    
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        # Create new user
        user = User(
            email=email,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Random password
            role=UserRole.SEEKER,
            is_active=True,
            is_verified=True,  # Email verified by Google
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create profile
        profile = Profile(
            user_id=user.id,
            name=name,
            tob_accuracy=TOBAccuracy.EXACT,
            preferred_system=ChartSystem.VEDIC,
            timezone="UTC",
        )
        db.add(profile)
        await db.commit()
    
    # Create JWT token
    jwt_token = create_access_token({"sub": user.email})
    
    # Redirect to dashboard with token
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard?token={jwt_token}")


@router.get("/microsoft/login")
async def microsoft_login(request: Request, settings: Settings = Depends(get_settings)):
    """Initiate Microsoft OAuth login"""
    # Generate state token for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = {"provider": "microsoft", "timestamp": datetime.utcnow()}
    
    # Microsoft OAuth configuration
    client_id = settings.MICROSOFT_CLIENT_ID
    redirect_uri = settings.MICROSOFT_REDIRECT_URI
    scope = "openid email profile"
    tenant = "common"  # Use 'common' for multi-tenant
    
    # Build authorization URL
    auth_url = (
        f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope={scope}&"
        f"state={state}&"
        f"response_mode=query"
    )
    
    return RedirectResponse(url=auth_url)


@router.get("/microsoft/callback")
async def microsoft_callback(
    code: str,
    state: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    settings: Settings = Depends(get_settings)
):
    """Handle Microsoft OAuth callback"""
    # Verify state
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Clean up state
    del oauth_states[state]
    
    # Exchange code for tokens
    client_id = settings.MICROSOFT_CLIENT_ID
    client_secret = settings.MICROSOFT_CLIENT_SECRET
    redirect_uri = settings.MICROSOFT_REDIRECT_URI
    tenant = "common"
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            }
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        # Get user info from Microsoft Graph
        user_response = await client.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_info = user_response.json()
    
    # Find or create user
    email = user_info.get("mail") or user_info.get("userPrincipalName")
    name = user_info.get("displayName", "")
    
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        # Create new user
        user = User(
            email=email,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Random password
            role=UserRole.SEEKER,
            is_active=True,
            is_verified=True,  # Email verified by Microsoft
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create profile
        profile = Profile(
            user_id=user.id,
            name=name,
            tob_accuracy=TOBAccuracy.EXACT,
            preferred_system=ChartSystem.VEDIC,
            timezone="UTC",
        )
        db.add(profile)
        await db.commit()
    
    # Create JWT token
    jwt_token = create_access_token({"sub": user.email})
    
    # Redirect to dashboard with token
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard?token={jwt_token}")
