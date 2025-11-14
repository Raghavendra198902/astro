"""
Chart Endpoints
Generate natal, divisional, and transit charts
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart
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
        # Calculate base chart
        chart_json = calculate_chart(
            chart_data.birth_datetime,
            chart_data.latitude,
            chart_data.longitude
        )
        
        # Add divisional charts
        divisional = calculate_divisional_charts(chart_json)
        chart_json["divisional_charts"] = divisional
        
        # Add Vimshottari Dasha
        dasha = calculate_vimshottari_dasha(
            chart_json["planets"]["Moon"]["longitude"],
            chart_data.birth_datetime
        )
        chart_json["vimshottari_dasha"] = dasha
        
        # Add Panchang
        panchang = calculate_panchang(chart_data.birth_datetime)
        chart_json["panchang"] = panchang
        
        # Add Shadbala
        shadbala = calculate_shadbala(chart_json, chart_data.birth_datetime)
        chart_json["shadbala"] = shadbala
        
        # Detect Yogas
        yogas = yoga_engine.detect_yogas(chart_json)
        chart_json["yogas"] = yogas
        
        # Save to database
        chart = Chart(
            user_id=current_user.id,
            chart_type="natal",
            chart_data=chart_json,
            birth_datetime=chart_data.birth_datetime,
            latitude=chart_data.latitude,
            longitude=chart_data.longitude,
            timezone=chart_data.timezone,
            place_name=chart_data.place_name
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
    chart_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chart by ID"""
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
    
    return chart


@router.get("/", response_model=list[ChartResponse])
async def list_charts(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's charts"""
    stmt = select(Chart).where(
        Chart.user_id == current_user.id
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
