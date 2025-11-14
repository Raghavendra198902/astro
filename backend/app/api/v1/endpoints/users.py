"""
User Management Endpoints
User profiles and settings
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash
from app.models.models import User
from app.schemas.schemas import UserResponse, UserUpdate

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


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user account"""
    current_user.is_active = False
    await db.commit()
    
    return None
