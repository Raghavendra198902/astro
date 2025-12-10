"""
Chart Endpoints
Generate natal, divisional, and transit charts
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart, Profile
from app.schemas.schemas import ChartCreate, ChartResponse
from app.services.chart.engine import (
    calculate_chart,
    calculate_divisional_charts,
    calculate_vimshottari_dasha,
    calculate_panchang,
    calculate_shadbala
)
from app.services.chart.yoga_engine import YogaEngine

router = APIRouter()
yoga_engine = YogaEngine()


@router.post("/natal", response_model=ChartResponse, status_code=status.HTTP_201_CREATED)
async def create_natal_chart(
    chart_data: ChartCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate natal chart with full calculations"""
    try:
        # Load profile data if profile_id provided
        if chart_data.profile_id:
            from sqlalchemy import select
            from app.models.models import Profile
            
            stmt = select(Profile).where(Profile.id == chart_data.profile_id, Profile.user_id == current_user.id)
            result = await db.execute(stmt)
            profile = result.scalar_one_or_none()
            
            if not profile:
                raise HTTPException(status_code=404, detail="Profile not found")
            
            birth_datetime = profile.dob_ts_utc
            latitude = profile.latitude
            longitude = profile.longitude
            timezone_str = profile.timezone
            place_name = profile.birthplace_text
        else:
            # If no profile_id, would need these fields in ChartCreate - for now return error
            raise HTTPException(status_code=400, detail="profile_id is required")
        
        # Calculate base chart
        chart_json = calculate_chart(
            birth_datetime,
            latitude,
            longitude,
            system="vedic"  # Use profile.preferred_system if needed
        )
        
        # Add divisional charts
        divisional = calculate_divisional_charts(
            chart_json["julian_day"],
            chart_json["planets"]
        )
        chart_json["divisional_charts"] = divisional
        
        # Add Vimshottari Dasha
        moon_long = chart_json["planets"]["moon"]["longitude"]
        dasha = calculate_vimshottari_dasha(
            chart_json["julian_day"],
            moon_long
        )
        chart_json["vimshottari_dasha"] = dasha
        
        # Add Panchang
        panchang = calculate_panchang(
            chart_json["julian_day"],
            latitude,
            longitude
        )
        chart_json["panchang"] = panchang
        
        # Add Shadbala
        shadbala = calculate_shadbala(
            chart_json["julian_day"],
            latitude,
            longitude,
            chart_json["planets"],
            chart_json["houses"]
        )
        chart_json["shadbala"] = shadbala
        
        # Detect Yogas
        yogas = yoga_engine.detect_yogas(
            chart_json["planets"],
            chart_json["houses"],
            chart_json["ascendant"]
        )
        chart_json["yogas"] = yogas
        
        # Generate hash for deduplication (include profile_id to make unique per profile)
        import hashlib
        import json
        from app.models.models import ChartSystem
        from sqlalchemy import select
        from sqlalchemy.exc import IntegrityError
        
        chart_str = json.dumps(chart_json, sort_keys=True) + str(chart_data.profile_id)
        hash_key = hashlib.sha256(chart_str.encode()).hexdigest()
        
        # Check if chart already exists
        stmt = select(Chart).where(Chart.hash_key == hash_key)
        result = await db.execute(stmt)
        existing_chart = result.scalar_one_or_none()
        
        if existing_chart:
            return existing_chart
        
        # Convert schema enum to model enum
        system_value = ChartSystem.VEDIC if chart_data.system.value == "vedic" else ChartSystem.WESTERN
        
        # Save to database
        chart = Chart(
            profile_id=chart_data.profile_id,
            system=system_value,
            json_payload=chart_json,
            hash_key=hash_key
        )
        
        db.add(chart)
        await db.commit()
        await db.refresh(chart)
        
        return chart
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chart calculation failed: {str(e)}"
        )


@router.get("/{chart_id}", response_model=ChartResponse)
async def get_chart(
    chart_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chart by ID"""
    from sqlalchemy import select
    stmt = select(Chart).where(
        Chart.id == chart_id,
        Chart.profile_id.in_(
            select(Profile.id).where(Profile.user_id == current_user.id)
        )
    )
    result = await db.execute(stmt)
    chart = result.scalars().first()
    
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    return chart


@router.get("/", response_model=list[ChartResponse])
async def list_charts(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's charts"""
    # Charts are linked via Profile, so join through profiles
    stmt = select(Chart).join(Profile).where(
        Profile.user_id == current_user.id
    ).offset(skip).limit(limit)
    
    result = await db.execute(stmt)
    charts = result.scalars().all()
    
    return charts


@router.delete("/{chart_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chart(
    chart_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete chart"""
    stmt = select(Chart).where(
        Chart.id == chart_id,
        Chart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    chart = result.scalars().first()
    
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    await db.delete(chart)
    await db.commit()
    
    return None


@router.get("/panchang")
async def get_panchang(
    date: str,
    time: str,
    latitude: float,
    longitude: float
):
    """
    Get Panchang (Hindu calendar) for a specific date, time, and location
    
    Args:
        date: Date in YYYY-MM-DD format
        time: Time in HH:MM format
        latitude: Latitude of location
        longitude: Longitude of location
    
    Returns:
        Panchang data including tithi, nakshatra, yoga, karana, etc.
    """
    try:
        from datetime import datetime
        import swisseph as swe
        
        # Combine date and time
        datetime_str = f"{date} {time}"
        birth_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
        
        # Convert to Julian Day
        jd = swe.julday(
            birth_datetime.year,
            birth_datetime.month,
            birth_datetime.day,
            birth_datetime.hour + birth_datetime.minute / 60.0
        )
        
        # Calculate Panchang using the engine instance
        from app.services.chart.engine import chart_engine
        panchang = chart_engine.calculate_panchang(jd, latitude, longitude)
        
        return panchang
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Panchang calculation failed: {str(e)}"
        )
