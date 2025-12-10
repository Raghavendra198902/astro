"""
Compatibility Endpoints
Kundali Milan and Western synastry analysis
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart, CompatibilityRequest as CompatibilityRequestModel
from app.schemas.schemas import (
    CompatibilityRequest,
    CompatibilityResponse
)
from app.services.compat.kundali_milan import KundaliMilan
from app.services.compat.western_synastry import WesternSynastry

router = APIRouter()


@router.post("/kundali-milan", response_model=CompatibilityResponse)
async def kundali_milan_analysis(
    request: CompatibilityRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Vedic compatibility using 36 Guna system"""
    # Get both charts
    stmt = select(Chart).where(Chart.id.in_([request.chart1_id, request.chart2_id]))
    result = await db.execute(stmt)
    charts = {chart.id: chart for chart in result.scalars().all()}
    
    if len(charts) != 2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both charts not found"
        )
    
    chart1 = charts[request.chart1_id]
    chart2 = charts[request.chart2_id]
    
    # Verify ownership
    if chart1.user_id != current_user.id and chart2.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Calculate Guna Milan
        kundali_milan = KundaliMilan()
        guna_result = kundali_milan.calculate_guna_milan(
            chart1.chart_data,
            chart2.chart_data
        )
        
        # Check Mangal Dosha
        mangal1 = kundali_milan.check_mangal_dosha(chart1.chart_data)
        mangal2 = kundali_milan.check_mangal_dosha(chart2.chart_data)
        
        analysis_data = {
            "method": "kundali_milan",
            "total_score": guna_result["total_score"],
            "max_score": guna_result["max_score"],
            "interpretation": guna_result["interpretation"],
            "breakdown": guna_result["breakdown"],
            "person1_mangal_dosha": mangal1,
            "person2_mangal_dosha": mangal2,
            "dosha_compatible": mangal1["has_dosha"] == mangal2["has_dosha"]
        }
        
        # Save analysis
        analysis = CompatibilityRequestModel(
            chart_a_id=chart1.id,
            chart_b_id=chart2.id,
            system="vedic",
            raw_json=analysis_data,
            guna_score=guna_result["total_score"]
        )
        
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compatibility analysis failed: {str(e)}"
        )


@router.post("/synastry", response_model=CompatibilityResponse)
async def western_synastry_analysis(
    request: CompatibilityRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Western synastry compatibility"""
    # Get both charts
    stmt = select(Chart).where(Chart.id.in_([request.chart1_id, request.chart2_id]))
    result = await db.execute(stmt)
    charts = {chart.id: chart for chart in result.scalars().all()}
    
    if len(charts) != 2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both charts not found"
        )
    
    chart1 = charts[request.chart1_id]
    chart2 = charts[request.chart2_id]
    
    # Verify ownership
    if chart1.user_id != current_user.id and chart2.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Analyze synastry
        synastry = WesternSynastry()
        synastry_result = synastry.analyze_synastry(
            chart1.chart_data,
            chart2.chart_data
        )
        
        # Calculate composite chart
        composite = synastry.calculate_composite_chart(
            chart1.chart_data,
            chart2.chart_data
        )
        
        analysis_data = {
            "method": "western_synastry",
            "aspects": synastry_result["aspects"],
            "sun_moon_compatibility": synastry_result["sun_moon_compatibility"],
            "venus_mars_chemistry": synastry_result["venus_mars_chemistry"],
            "composite_chart": composite,
            "overall_score": synastry_result["overall_score"]
        }
        
        # Save analysis
        analysis = CompatibilityRequestModel(
            chart_a_id=chart1.id,
            chart_b_id=chart2.id,
            system="western",
            raw_json=analysis_data,
            synastry_score=synastry_result["overall_score"]
        )
        
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Synastry analysis failed: {str(e)}"
        )


@router.get("/{analysis_id}", response_model=CompatibilityResponse)
async def get_compatibility_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get compatibility analysis by ID"""
    stmt = select(CompatibilityRequestModel).join(
        Chart, CompatibilityRequestModel.chart_a_id == Chart.id
    ).where(
        CompatibilityRequestModel.id == analysis_id
    )
    result = await db.execute(stmt)
    analysis = result.scalars().first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Verify ownership
    stmt1 = select(Chart).where(Chart.id == analysis.chart1_id)
    stmt2 = select(Chart).where(Chart.id == analysis.chart2_id)
    
    result1 = await db.execute(stmt1)
    result2 = await db.execute(stmt2)
    
    chart1 = result1.scalars().first()
    chart2 = result2.scalars().first()
    
    if chart1.user_id != current_user.id and chart2.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return analysis
