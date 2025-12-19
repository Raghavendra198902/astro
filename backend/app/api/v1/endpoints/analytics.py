"""
Enterprise Analytics API Endpoints
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.analytics.analytics_service import AnalyticsService, PerformanceMonitor

router = APIRouter()


@router.get("/dashboard")
async def get_analytics_dashboard(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get comprehensive analytics dashboard
    
    Returns metrics including:
    - Total events
    - Unique users
    - Charts generated
    - Predictions made
    - Average response time
    - Error rate
    - Top events
    """
    stats = await AnalyticsService.get_dashboard_stats(db, start_date, end_date)
    return stats


@router.get("/user-activity/{user_id}")
async def get_user_activity(
    user_id: int,
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get recent activity for a specific user"""
    # Users can only view their own activity unless admin
    if current_user.id != user_id and not hasattr(current_user, 'is_admin'):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    activity = await AnalyticsService.get_user_activity(db, user_id, limit)
    return {"user_id": user_id, "activity": activity}


@router.get("/time-series")
async def get_time_series(
    metric: str = Query(..., description="Metric to track (e.g., chart_generated, api_call)"),
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    interval: str = Query("day", regex="^(hour|day|week|month)$"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get time series data for a metric
    
    Intervals: hour, day, week, month
    """
    data = await AnalyticsService.get_time_series(
        db, metric, start_date, end_date, interval
    )
    return {
        "metric": metric,
        "interval": interval,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "data": data
    }


@router.get("/performance/slow-endpoints")
async def get_slow_endpoints(
    threshold_ms: float = Query(1000, description="Threshold in milliseconds"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get slowest API endpoints"""
    endpoints = await PerformanceMonitor.get_slow_endpoints(db, threshold_ms, limit)
    return {"threshold_ms": threshold_ms, "slow_endpoints": endpoints}


@router.post("/track")
async def track_custom_event(
    event_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Track a custom analytics event
    
    Body:
    {
        "event_type": "custom_action",
        "category": "user_interaction",
        "action": "clicked",
        "label": "generate_chart_button",
        "value": 1.0,
        "properties": {"additional": "data"}
    }
    """
    await AnalyticsService.track_event(
        db=db,
        event_type=event_data.get("event_type"),
        user_id=current_user.id,
        category=event_data.get("category"),
        action=event_data.get("action"),
        label=event_data.get("label"),
        value=event_data.get("value"),
        properties=event_data.get("properties")
    )
    
    return {"status": "tracked", "event_type": event_data.get("event_type")}
