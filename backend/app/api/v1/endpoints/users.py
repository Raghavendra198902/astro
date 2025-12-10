"""
User Management Endpoints
User profiles and settings
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash
from app.models.models import User, Profile, TOBAccuracy, ChartSystem
from app.schemas.schemas import UserResponse, UserUpdate, ProfileResponse, ProfileCreate
from datetime import datetime
import pytz

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user profile"""
    # Update fields
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    if user_update.birth_datetime is not None:
        current_user.birth_datetime = user_update.birth_datetime
    
    if user_update.birth_latitude is not None:
        current_user.birth_latitude = user_update.birth_latitude
    
    if user_update.birth_longitude is not None:
        current_user.birth_longitude = user_update.birth_longitude
    
    if user_update.birth_place is not None:
        current_user.birth_place = user_update.birth_place
    
    if user_update.timezone is not None:
        current_user.timezone = user_update.timezone
    
    if user_update.password is not None:
        current_user.hashed_password = get_password_hash(user_update.password)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.get("/profiles", response_model=list[ProfileResponse])
async def list_user_profiles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all profiles for current user"""
    stmt = select(Profile).where(Profile.user_id == current_user.id)
    result = await db.execute(stmt)
    profiles = result.scalars().all()
    return profiles


@router.post("/profiles", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new profile for the current user"""
    # Parse date and time
    try:
        date_parts = profile_data.date_of_birth.split('-')
        time_parts = profile_data.time_of_birth.split(':')
        
        year = int(date_parts[0])
        month = int(date_parts[1])
        day = int(date_parts[2])
        hour = int(time_parts[0])
        minute = int(time_parts[1])
        second = int(time_parts[2]) if len(time_parts) > 2 else 0
        
        # Create datetime in the specified timezone
        tz = pytz.timezone(profile_data.timezone or 'UTC')
        local_dt = tz.localize(datetime(year, month, day, hour, minute, second))
        
        # Convert to UTC
        utc_dt = local_dt.astimezone(pytz.UTC)
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid date/time format: {str(e)}"
        )
    
    # Create profile
    new_profile = Profile(
        user_id=current_user.id,
        name=profile_data.name,
        dob_ts_utc=utc_dt,
        tob_accuracy=TOBAccuracy[profile_data.tob_accuracy.value.upper()],
        birthplace_text=profile_data.birthplace,
        latitude=profile_data.latitude or 0.0,
        longitude=profile_data.longitude or 0.0,
        timezone=profile_data.timezone or 'UTC',
        preferred_system=ChartSystem[profile_data.preferred_system.value.upper()],
        language=profile_data.language
    )
    
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)
    
    return new_profile


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user account"""
    current_user.is_active = False
    await db.commit()
    
    return None
