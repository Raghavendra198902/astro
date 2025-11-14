"""
Interpretation Endpoints
AI-powered chart interpretation
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart, AIRun
from app.schemas.schemas import InterpretationRequest, InterpretationResponse
from app.services.ai.interpretation_engine import InterpretationEngine
from app.services.ai.llm_client import OpenAIClient
from app.services.ai.rag_engine import RAGEngine

router = APIRouter()

# Initialize AI engine (in production, use dependency injection)
interp_engine = InterpretationEngine()


@router.post("/natal/{chart_id}", response_model=InterpretationResponse)
async def interpret_natal(
    chart_id: int,
    request: InterpretationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate AI interpretation for natal chart"""
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
        # Generate interpretation
        interpretation_text, confidence, ai_run_id = await interp_engine.interpret_natal_chart(
            chart.chart_data,
            style=request.style,
            focus_areas=request.focus_areas
        )
        
        # Save interpretation
        interpretation = AIRun(
            chart_id=chart.id,
            interpretation_type="natal",
            interpretation_text=interpretation_text,
            ai_provider="openai",
            ai_model="gpt-4",
            confidence_score=confidence,
            ai_run_id=ai_run_id
        )
        
        db.add(interpretation)
        await db.commit()
        await db.refresh(interpretation)
        
        return interpretation
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Interpretation failed: {str(e)}"
        )


@router.post("/transit/{chart_id}", response_model=InterpretationResponse)
async def interpret_transit(
    chart_id: int,
    request: InterpretationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Interpret current transits for natal chart"""
    # Get natal chart
    stmt = select(Chart).where(
        Chart.id == chart_id,
        Chart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    natal_chart = result.scalars().first()
    
    if not natal_chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    try:
        from datetime import datetime
        from app.services.chart.engine import calculate_chart
        
        # Calculate current transit chart
        transit_chart = calculate_chart(
            datetime.utcnow(),
            natal_chart.latitude,
            natal_chart.longitude
        )
        
        # Generate interpretation
        interpretation_text, confidence, ai_run_id = await interp_engine.interpret_transit(
            natal_chart.chart_data,
            transit_chart,
            style=request.style
        )
        
        # Save interpretation
        interpretation = AIRun(
            chart_id=natal_chart.id,
            interpretation_type="transit",
            interpretation_text=interpretation_text,
            ai_provider="openai",
            ai_model="gpt-4",
            confidence_score=confidence,
            ai_run_id=ai_run_id
        )
        
        db.add(interpretation)
        await db.commit()
        await db.refresh(interpretation)
        
        return interpretation
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transit interpretation failed: {str(e)}"
        )


@router.post("/dasha/{chart_id}", response_model=InterpretationResponse)
async def interpret_dasha(
    chart_id: int,
    request: InterpretationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Interpret current dasha period"""
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
        # Get current dasha from chart data
        dasha_info = chart.chart_data.get("vimshottari_dasha", {})
        
        if not dasha_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chart does not have dasha information"
            )
        
        # Generate interpretation
        interpretation_text, confidence, ai_run_id = await interp_engine.interpret_dasha_period(
            chart.chart_data,
            dasha_info,
            style=request.style
        )
        
        # Save interpretation
        interpretation = AIRun(
            chart_id=chart.id,
            interpretation_type="dasha",
            interpretation_text=interpretation_text,
            ai_provider="openai",
            ai_model="gpt-4",
            confidence_score=confidence,
            ai_run_id=ai_run_id
        )
        
        db.add(interpretation)
        await db.commit()
        await db.refresh(interpretation)
        
        return interpretation
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dasha interpretation failed: {str(e)}"
        )


@router.get("/{interpretation_id}", response_model=InterpretationResponse)
async def get_interpretation(
    interpretation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get interpretation by ID"""
    stmt = select(Interpretation).join(Chart).where(
        Interpretation.id == interpretation_id,
        Chart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    interpretation = result.scalars().first()
    
    if not interpretation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interpretation not found"
        )
    
    return interpretation
