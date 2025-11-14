"""
Numerology Endpoints
Calculate numerology profiles
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, NumerologyProfile
from app.schemas.schemas import (
    NumerologyRequest,
    NumerologyResponse
)
from app.services.numerology.engine import calculate_full_analysis

router = APIRouter()


@router.post("/", response_model=NumerologyResponse, status_code=status.HTTP_201_CREATED)
async def create_numerology_profile(
    request: NumerologyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate complete numerology profile"""
    try:
        # Calculate numerology
        analysis = calculate_full_analysis(
            birth_date=request.birth_date,
            full_name=request.full_name,
            system=request.system
        )
        
        # Save profile
        profile = NumerologyProfile(
            user_id=current_user.id,
            full_name=request.full_name,
            birth_date=request.birth_date,
            system=request.system,
            life_path_number=analysis["life_path"]["number"],
            expression_number=analysis["expression"]["number"],
            soul_urge_number=analysis["soul_urge"]["number"],
            personality_number=analysis["personality"]["number"],
            maturity_number=analysis.get("maturity", {}).get("number"),
            analysis_data=analysis
        )
        
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
        return profile
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Numerology calculation failed: {str(e)}"
        )


@router.get("/{profile_id}", response_model=NumerologyResponse)
async def get_numerology_profile(
    profile_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get numerology profile by ID"""
    stmt = select(NumerologyProfile).where(
        NumerologyProfile.id == profile_id,
        NumerologyProfile.user_id == current_user.id
    )
    result = await db.execute(stmt)
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile


@router.get("/", response_model=list[NumerologyResponse])
async def list_numerology_profiles(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's numerology profiles"""
    stmt = select(NumerologyProfile).where(
        NumerologyProfile.user_id == current_user.id
    ).offset(skip).limit(limit)
    
    result = await db.execute(stmt)
    profiles = result.scalars().all()
    
    return profiles
