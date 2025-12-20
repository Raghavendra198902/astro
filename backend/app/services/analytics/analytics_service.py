"""
Enterprise Analytics and Monitoring System
Tracks usage, performance, and business metrics
"""
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Index, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Base
import logging

logger = logging.getLogger(__name__)


class AnalyticsEvent(Base):
    """Track all system events for analytics"""
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    user_id = Column(Integer, index=True)
    session_id = Column(String(100), index=True)
    
    # Event metadata
    event_category = Column(String(50), index=True)  # chart, prediction, consultation, etc.
    event_action = Column(String(50))  # view, generate, download, etc.
    event_label = Column(String(200))
    event_value = Column(Float)
    
    # Technical metadata
    endpoint = Column(String(200))
    method = Column(String(10))
    status_code = Column(Integer)
    response_time_ms = Column(Float)
    
    # User context
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    country = Column(String(2))
    city = Column(String(100))
    
    # Custom properties
    properties = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    __table_args__ = (
        Index('idx_analytics_created', 'created_at'),
        Index('idx_analytics_user_event', 'user_id', 'event_type'),
        Index('idx_analytics_category', 'event_category', 'created_at'),
    )


class UsageMetric(Base):
    """Aggregated usage metrics for dashboard"""
    __tablename__ = "usage_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_date = Column(DateTime, nullable=False, index=True)
    metric_type = Column(String(50), nullable=False)
    
    # Counts
    total_requests = Column(Integer, default=0)
    unique_users = Column(Integer, default=0)
    new_users = Column(Integer, default=0)
    
    # Performance
    avg_response_time = Column(Float)
    p95_response_time = Column(Float)
    p99_response_time = Column(Float)
    
    # Errors
    error_count = Column(Integer, default=0)
    error_rate = Column(Float)
    
    # Business metrics
    charts_generated = Column(Integer, default=0)
    predictions_made = Column(Integer, default=0)
    consultations_booked = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)
    
    # Aggregation metadata
    aggregated_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_metrics_date_type', 'metric_date', 'metric_type'),
    )


class AnalyticsService:
    """Service for tracking and querying analytics"""
    
    @staticmethod
    async def track_event(
        db: AsyncSession,
        event_type: str,
        user_id: Optional[int] = None,
        session_id: Optional[str] = None,
        category: Optional[str] = None,
        action: Optional[str] = None,
        label: Optional[str] = None,
        value: Optional[float] = None,
        endpoint: Optional[str] = None,
        method: Optional[str] = None,
        status_code: Optional[int] = None,
        response_time_ms: Optional[float] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        properties: Optional[Dict] = None
    ):
        """Track an analytics event"""
        try:
            event = AnalyticsEvent(
                event_type=event_type,
                user_id=user_id,
                session_id=session_id,
                event_category=category,
                event_action=action,
                event_label=label,
                event_value=value,
                endpoint=endpoint,
                method=method,
                status_code=status_code,
                response_time_ms=response_time_ms,
                ip_address=ip_address,
                user_agent=user_agent,
                properties=properties or {}
            )
            
            db.add(event)
            await db.commit()
            
        except Exception as e:
            logger.error(f"Error tracking event: {e}")
            await db.rollback()
    
    @staticmethod
    async def get_dashboard_stats(
        db: AsyncSession,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get comprehensive dashboard statistics"""
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        if not end_date:
            end_date = datetime.utcnow()
        
        try:
            # Total events
            total_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date)
            )
            total_result = await db.execute(total_stmt)
            total_events = total_result.scalar() or 0
            
            # Unique users
            users_stmt = select(func.count(func.distinct(AnalyticsEvent.user_id))).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.user_id.isnot(None)
            )
            users_result = await db.execute(users_stmt)
            unique_users = users_result.scalar() or 0
            
            # Charts generated
            charts_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.event_category == "chart",
                AnalyticsEvent.event_action == "generate"
            )
            charts_result = await db.execute(charts_stmt)
            charts_generated = charts_result.scalar() or 0
            
            # Predictions made
            predictions_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.event_category == "prediction",
                AnalyticsEvent.event_action == "generate"
            )
            predictions_result = await db.execute(predictions_stmt)
            predictions_made = predictions_result.scalar() or 0
            
            # Consultations booked
            consultations_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.event_category == "consultation",
                AnalyticsEvent.event_action == "book"
            )
            consultations_result = await db.execute(consultations_stmt)
            consultations_booked = consultations_result.scalar() or 0
            
            # Compatibility checks
            compatibility_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.event_category == "compatibility",
                AnalyticsEvent.event_action == "analyze"
            )
            compatibility_result = await db.execute(compatibility_stmt)
            compatibility_checks = compatibility_result.scalar() or 0
            
            # Average response time
            response_stmt = select(func.avg(AnalyticsEvent.response_time_ms)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.response_time_ms.isnot(None)
            )
            response_result = await db.execute(response_stmt)
            avg_response_time = response_result.scalar() or 0
            
            # Error rate
            error_stmt = select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.created_at.between(start_date, end_date),
                AnalyticsEvent.status_code >= 400
            )
            error_result = await db.execute(error_stmt)
            error_count = error_result.scalar() or 0
            error_rate = (error_count / total_events * 100) if total_events > 0 else 0
            
            # Top events
            top_events_stmt = select(
                AnalyticsEvent.event_type,
                func.count(AnalyticsEvent.id).label('count')
            ).where(
                AnalyticsEvent.created_at.between(start_date, end_date)
            ).group_by(
                AnalyticsEvent.event_type
            ).order_by(
                func.count(AnalyticsEvent.id).desc()
            ).limit(10)
            
            top_events_result = await db.execute(top_events_stmt)
            top_events = [
                {"event_type": row[0], "count": row[1]}
                for row in top_events_result.fetchall()
            ]
            
            return {
                "period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "overview": {
                    "total_events": total_events,
                    "unique_users": unique_users,
                    "charts_generated": charts_generated,
                    "predictions_made": predictions_made,
                    "consultations_booked": consultations_booked,
                    "compatibility_checks": compatibility_checks,
                    "avg_response_time_ms": round(avg_response_time, 2),
                    "error_count": error_count,
                    "error_rate_percent": round(error_rate, 2)
                },
                "top_events": top_events
            }
            
        except Exception as e:
            logger.error(f"Error getting dashboard stats: {e}")
            return {}
    
    @staticmethod
    async def get_user_activity(
        db: AsyncSession,
        user_id: int,
        limit: int = 50
    ) -> List[Dict]:
        """Get recent activity for a user"""
        try:
            stmt = select(AnalyticsEvent).where(
                AnalyticsEvent.user_id == user_id
            ).order_by(
                AnalyticsEvent.created_at.desc()
            ).limit(limit)
            
            result = await db.execute(stmt)
            events = result.scalars().all()
            
            return [
                {
                    "event_type": event.event_type,
                    "category": event.event_category,
                    "action": event.event_action,
                    "label": event.event_label,
                    "timestamp": event.created_at.isoformat(),
                    "properties": event.properties
                }
                for event in events
            ]
            
        except Exception as e:
            logger.error(f"Error getting user activity: {e}")
            return []
    
    @staticmethod
    async def get_time_series(
        db: AsyncSession,
        metric: str,
        start_date: datetime,
        end_date: datetime,
        interval: str = "day"  # hour, day, week, month
    ) -> List[Dict]:
        """Get time series data for a metric"""
        try:
            # Determine date truncation based on interval
            if interval == "hour":
                trunc_func = func.date_trunc('hour', AnalyticsEvent.created_at)
            elif interval == "week":
                trunc_func = func.date_trunc('week', AnalyticsEvent.created_at)
            elif interval == "month":
                trunc_func = func.date_trunc('month', AnalyticsEvent.created_at)
            else:  # day
                trunc_func = func.date_trunc('day', AnalyticsEvent.created_at)
            
            stmt = select(
                trunc_func.label('period'),
                func.count(AnalyticsEvent.id).label('count')
            ).where(
                AnalyticsEvent.created_at.between(start_date, end_date)
            ).group_by(
                'period'
            ).order_by(
                'period'
            )
            
            if metric != "all":
                stmt = stmt.where(AnalyticsEvent.event_type == metric)
            
            result = await db.execute(stmt)
            
            return [
                {
                    "period": row[0].isoformat(),
                    "count": row[1]
                }
                for row in result.fetchall()
            ]
            
        except Exception as e:
            logger.error(f"Error getting time series: {e}")
            return []


class PerformanceMonitor:
    """Monitor system performance metrics"""
    
    @staticmethod
    async def record_api_call(
        db: AsyncSession,
        endpoint: str,
        method: str,
        status_code: int,
        response_time_ms: float,
        user_id: Optional[int] = None
    ):
        """Record API call performance"""
        await AnalyticsService.track_event(
            db=db,
            event_type="api_call",
            category="performance",
            action=method,
            label=endpoint,
            user_id=user_id,
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            response_time_ms=response_time_ms
        )
    
    @staticmethod
    async def get_slow_endpoints(
        db: AsyncSession,
        threshold_ms: float = 1000,
        limit: int = 10
    ) -> List[Dict]:
        """Get slowest endpoints"""
        try:
            stmt = select(
                AnalyticsEvent.endpoint,
                func.avg(AnalyticsEvent.response_time_ms).label('avg_time'),
                func.count(AnalyticsEvent.id).label('count')
            ).where(
                AnalyticsEvent.response_time_ms > threshold_ms
            ).group_by(
                AnalyticsEvent.endpoint
            ).order_by(
                func.avg(AnalyticsEvent.response_time_ms).desc()
            ).limit(limit)
            
            result = await db.execute(stmt)
            
            return [
                {
                    "endpoint": row[0],
                    "avg_response_time_ms": round(row[1], 2),
                    "call_count": row[2]
                }
                for row in result.fetchall()
            ]
            
        except Exception as e:
            logger.error(f"Error getting slow endpoints: {e}")
            return []
