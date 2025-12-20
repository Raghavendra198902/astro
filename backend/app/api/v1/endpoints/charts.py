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


@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_chart_quick(
    chart_data: dict,
):
    """Quick chart generation for frontend display - No auth required for demo"""
    from datetime import datetime
    import pytz
    
    try:
        # Parse input
        date_str = chart_data.get("date")  # "1978-09-07"
        time_str = chart_data.get("time")  # "14:45"
        latitude = float(chart_data.get("latitude", 0))
        longitude = float(chart_data.get("longitude", 0))
        timezone_str = chart_data.get("timezone", "Asia/Kolkata")
        chart_type = chart_data.get("chartType", "rasi")  # Get chart type
        chart_system = chart_data.get("system", "vedic")  # Get system (vedic or western)
        
        # Combine date and time
        dt_local = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        tz = pytz.timezone(timezone_str)
        dt_local = tz.localize(dt_local)
        dt_utc = dt_local.astimezone(pytz.UTC)
        
        # Calculate base chart (D1/Rasi) using the requested system
        chart_json = calculate_chart(
            dt_utc,
            latitude,
            longitude,
            system=chart_system
        )
        
        # Handle divisional charts
        divisional_map = {
            "navamsa": "D9",
            "dashamsa": "D10",
            "dwadasamsa": "D12",
            "trimsamsa": "D30",
            "saptamsa": "D7"
        }
        
        if chart_type in divisional_map:
            # Calculate all divisional charts
            from app.services.chart.engine import chart_engine
            jd = chart_engine.calculate_julian_day(dt_utc)
            divisional_charts = chart_engine.calculate_divisional_charts(jd, chart_json["planets"])
            
            div_key = divisional_map[chart_type]
            if div_key in divisional_charts:
                # Replace planet positions with divisional positions
                chart_json["planets"] = divisional_charts[div_key]["positions"]
                chart_json["chart_type"] = chart_type
                chart_json["division_name"] = divisional_charts[div_key]["name"]
        elif chart_type == "rasi":
            chart_json["chart_type"] = "rasi"
            chart_json["division_name"] = "Rasi (D1)"
        else:
            # For Western charts and transits
            chart_json["chart_type"] = chart_type
            chart_json["division_name"] = chart_type.title()
            
            # Add current transits for comparison
            if chart_type in ["natal", "solar", "progressed"]:
                from datetime import datetime as dt_module
                current_utc = dt_module.utcnow()
                transit_chart = calculate_chart(
                    current_utc,
                    latitude,
                    longitude,
                    system=chart_system
                )
                chart_json["transits"] = {
                    "timestamp": current_utc.isoformat(),
                    "planets": transit_chart["planets"]
                }
        
        # Detect yogas (only for D1/Rasi)
        if chart_type == "rasi":
            yogas = yoga_engine.detect_yogas(
                chart_json["planets"],
                chart_json["houses"],
                chart_json["ascendant"]
            )
            chart_json["yogas"] = yogas[:5]  # Top 5 yogas
        else:
            chart_json["yogas"] = []
        
        return chart_json
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
        
        # Calculate base chart using the requested system
        system_str = "vedic" if chart_data.system.value == "vedic" else "western"
        chart_json = calculate_chart(
            birth_datetime,
            latitude,
            longitude,
            system=system_str
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
