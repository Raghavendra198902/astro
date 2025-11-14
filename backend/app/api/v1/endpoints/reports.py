"""
Reports Endpoints
Generate PDF reports
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import io

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart, CompatibilityAnalysis
from app.services.reports.generator import ReportGenerator

router = APIRouter()
report_generator = ReportGenerator()


@router.get("/natal/{chart_id}", response_class=StreamingResponse)
async def generate_natal_report(
    chart_id: int,
    theme: str = "classic",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate PDF natal chart report"""
    # Get chart
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
    
    try:
        # Generate PDF
        pdf_bytes = report_generator.generate_natal_report(
            chart.chart_data,
            chart.birth_datetime,
            chart.place_name or "Unknown",
            theme=theme
        )
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=natal_chart_{chart_id}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )


@router.get("/compatibility/{analysis_id}", response_class=StreamingResponse)
async def generate_compatibility_report(
    analysis_id: int,
    theme: str = "classic",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate PDF compatibility report"""
    # Get analysis
    stmt = select(CompatibilityAnalysis).where(
        CompatibilityAnalysis.id == analysis_id
    )
    result = await db.execute(stmt)
    analysis = result.scalars().first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get charts
    stmt1 = select(Chart).where(Chart.id == analysis.chart1_id)
    stmt2 = select(Chart).where(Chart.id == analysis.chart2_id)
    
    result1 = await db.execute(stmt1)
    result2 = await db.execute(stmt2)
    
    chart1 = result1.scalars().first()
    chart2 = result2.scalars().first()
    
    # Verify ownership
    if chart1.user_id != current_user.id and chart2.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Generate PDF
        pdf_bytes = report_generator.generate_compatibility_report(
            chart1.chart_data,
            chart2.chart_data,
            analysis.analysis_data,
            theme=theme
        )
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=compatibility_{analysis_id}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )


@router.get("/transit/{chart_id}", response_class=StreamingResponse)
async def generate_transit_report(
    chart_id: int,
    days: int = 30,
    theme: str = "classic",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate PDF transit forecast report"""
    # Get chart
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
    
    try:
        from datetime import datetime, timedelta
        
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=days)
        
        # Generate PDF
        pdf_bytes = report_generator.generate_transit_report(
            chart.chart_data,
            start_date,
            end_date,
            theme=theme
        )
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=transit_forecast_{chart_id}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )
