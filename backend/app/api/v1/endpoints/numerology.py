"""
Numerology Endpoints
Calculate numerology profiles
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, NumerologyRun, Profile
from app.schemas.schemas import (
    NumerologyRequest,
    NumerologyResponse
)
from app.services.numerology.engine import NumerologyEngine

router = APIRouter()

# Initialize numerology engine
numerology_engine = NumerologyEngine()


@router.post("/", response_model=NumerologyResponse, status_code=status.HTTP_201_CREATED)
async def create_numerology_analysis(
    request: NumerologyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate numerology analysis for a profile"""
    try:
        # Get profile_id (use provided or first profile)
        profile_id = request.profile_id
        if not profile_id:
            stmt = select(Profile).where(Profile.user_id == current_user.id).limit(1)
            result = await db.execute(stmt)
            first_profile = result.scalars().first()
            if not first_profile:
                raise HTTPException(status_code=404, detail="No profile found")
            profile_id = first_profile.id
        
        # Get the profile
        stmt = select(Profile).where(
            Profile.id == profile_id,
            Profile.user_id == current_user.id
        )
        result = await db.execute(stmt)
        profile = result.scalars().first()
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Calculate numerology using request name (not profile name)
        analysis = numerology_engine.calculate_full_analysis(
            birth_date=profile.dob_ts_utc,
            full_name=request.full_name,  # Use provided name
            system=request.system
        )
        
        # Create input hash for deduplication
        import hashlib
        input_str = f"{profile_id}{request.system}{request.full_name}"
        input_hash = hashlib.sha256(input_str.encode()).hexdigest()
        
        # Check if analysis already exists
        stmt = select(NumerologyRun).where(
            NumerologyRun.profile_id == profile.id,
            NumerologyRun.input_hash == input_hash
        )
        result = await db.execute(stmt)
        existing = result.scalars().first()
        
        if existing:
            return existing
        
        # Save new analysis
        numerology_run = NumerologyRun(
            profile_id=profile.id,
            system=request.system,
            input_hash=input_hash,
            json_result=analysis
        )
        
        db.add(numerology_run)
        await db.commit()
        await db.refresh(numerology_run)
        
        return numerology_run
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Numerology calculation failed: {str(e)}"
        )


@router.get("/{run_id}", response_model=NumerologyResponse)
async def get_numerology_analysis(
    run_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get numerology analysis by ID"""
    from uuid import UUID
    
    try:
        run_uuid = UUID(run_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID format"
        )
    
    # Join with Profile to verify ownership
    stmt = select(NumerologyRun).join(Profile).where(
        NumerologyRun.id == run_uuid,
        Profile.user_id == current_user.id
    )
    result = await db.execute(stmt)
    numerology_run = result.scalars().first()
    
    if not numerology_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return numerology_run


@router.get("/", response_model=list[NumerologyResponse])
async def list_numerology_analyses(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's numerology analyses across all profiles"""
    stmt = (
        select(NumerologyRun)
        .join(Profile)
        .where(Profile.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(NumerologyRun.created_at.desc())
    )
    
    result = await db.execute(stmt)
    analyses = result.scalars().all()
    
    return analyses
