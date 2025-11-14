"""
Transit & Alert Endpoints
Manage transit watches and alerts
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Chart, TransitWatch
from app.schemas.schemas import (
    TransitWatchRequest,
    TransitWatchResponse
)

router = APIRouter()


@router.post("/watch", response_model=TransitWatchResponse, status_code=status.HTTP_201_CREATED)
async def create_transit_watch(
    request: TransitWatchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create transit watch for notifications"""
    # Verify chart ownership
    stmt = select(Chart).where(
        Chart.id == request.chart_id,
        Chart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    chart = result.scalars().first()
    
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    # Create transit watch
    watch = TransitWatch(
        chart_id=request.chart_id,
        transit_type=request.transit_type,
        is_active=True
    )
    
    db.add(watch)
    await db.commit()
    await db.refresh(watch)
    
    return watch


@router.get("/watch", response_model=list[TransitWatchResponse])
async def list_transit_watches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's active transit watches"""
    stmt = select(TransitWatch).join(Chart).where(
        Chart.user_id == current_user.id,
        TransitWatch.is_active == True
    )
    
    result = await db.execute(stmt)
    watches = result.scalars().all()
    
    return watches


@router.delete("/watch/{watch_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transit_watch(
    watch_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete/deactivate transit watch"""
    # Get watch with chart verification
    stmt = select(TransitWatch).join(Chart).where(
        TransitWatch.id == watch_id,
        Chart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    watch = result.scalars().first()
    
    if not watch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transit watch not found"
        )
    
    watch.is_active = False
    await db.commit()
    
    return None
