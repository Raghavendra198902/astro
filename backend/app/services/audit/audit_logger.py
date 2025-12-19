"""
Enterprise Audit Logging System
Comprehensive audit trail for compliance and security
"""
from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, Text, Index, Enum as SQLEnum
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Base
import enum
import logging
import json

logger = logging.getLogger(__name__)


class AuditEventType(str, enum.Enum):
    """Types of audit events"""
    # Authentication
    LOGIN = "login"
    LOGOUT = "logout"
    LOGIN_FAILED = "login_failed"
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET = "password_reset"
    
    # User Management
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    USER_ACTIVATED = "user_activated"
    USER_DEACTIVATED = "user_deactivated"
    
    # Data Access
    DATA_VIEWED = "data_viewed"
    DATA_CREATED = "data_created"
    DATA_UPDATED = "data_updated"
    DATA_DELETED = "data_deleted"
    DATA_EXPORTED = "data_exported"
    
    # Chart Operations
    CHART_GENERATED = "chart_generated"
    CHART_DOWNLOADED = "chart_downloaded"
    CHART_SHARED = "chart_shared"
    
    # Predictions
    PREDICTION_REQUESTED = "prediction_requested"
    PREDICTION_GENERATED = "prediction_generated"
    
    # Payments
    PAYMENT_INITIATED = "payment_initiated"
    PAYMENT_COMPLETED = "payment_completed"
    PAYMENT_FAILED = "payment_failed"
    PAYMENT_REFUNDED = "payment_refunded"
    
    # System
    SYSTEM_ERROR = "system_error"
    SYSTEM_WARNING = "system_warning"
    API_RATE_LIMIT = "api_rate_limit"
    UNAUTHORIZED_ACCESS = "unauthorized_access"
    
    # Admin Actions
    ADMIN_ACTION = "admin_action"
    CONFIG_CHANGE = "config_change"
    SECURITY_ALERT = "security_alert"


class AuditSeverity(str, enum.Enum):
    """Severity levels for audit events"""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AuditLog(Base):
    """Comprehensive audit log table"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Event identification
    event_id = Column(String(100), unique=True, nullable=False, index=True)
    event_type = Column(SQLEnum(AuditEventType), nullable=False, index=True)
    severity = Column(SQLEnum(AuditSeverity), default=AuditSeverity.INFO, index=True)
    
    # User context
    user_id = Column(Integer, index=True)
    username = Column(String(255))
    session_id = Column(String(100))
    
    # Request context
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    endpoint = Column(String(200))
    method = Column(String(10))
    
    # Location
    country = Column(String(2))
    city = Column(String(100))
    
    # Event details
    action = Column(String(200))
    resource_type = Column(String(50))
    resource_id = Column(String(100))
    
    # Change tracking
    old_value = Column(JSON)
    new_value = Column(JSON)
    
    # Additional context
    description = Column(Text)
    metadata = Column(JSON)
    
    # Status
    status = Column(String(20))  # success, failure, partial
    error_message = Column(Text)
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    __table_args__ = (
        Index('idx_audit_user_event', 'user_id', 'event_type'),
        Index('idx_audit_timestamp', 'timestamp'),
        Index('idx_audit_severity', 'severity', 'timestamp'),
        Index('idx_audit_resource', 'resource_type', 'resource_id'),
    )


class AuditLogger:
    """Service for creating audit log entries"""
    
    @staticmethod
    async def log_event(
        db: AsyncSession,
        event_type: AuditEventType,
        severity: AuditSeverity = AuditSeverity.INFO,
        user_id: Optional[int] = None,
        username: Optional[str] = None,
        session_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        endpoint: Optional[str] = None,
        method: Optional[str] = None,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        old_value: Optional[Dict] = None,
        new_value: Optional[Dict] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict] = None,
        status: str = "success",
        error_message: Optional[str] = None
    ) -> AuditLog:
        """Create a new audit log entry"""
        import uuid
        
        try:
            audit_entry = AuditLog(
                event_id=str(uuid.uuid4()),
                event_type=event_type,
                severity=severity,
                user_id=user_id,
                username=username,
                session_id=session_id,
                ip_address=ip_address,
                user_agent=user_agent,
                endpoint=endpoint,
                method=method,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                old_value=old_value,
                new_value=new_value,
                description=description,
                metadata=metadata or {},
                status=status,
                error_message=error_message
            )
            
            db.add(audit_entry)
            await db.commit()
            await db.refresh(audit_entry)
            
            # Log to application logger for critical events
            if severity in [AuditSeverity.ERROR, AuditSeverity.CRITICAL]:
                logger.warning(
                    f"AUDIT {severity.value.upper()}: {event_type.value} - "
                    f"User: {user_id}, Action: {action}, Status: {status}"
                )
            
            return audit_entry
            
        except Exception as e:
            logger.error(f"Failed to create audit log: {e}")
            await db.rollback()
            raise
    
    @staticmethod
    async def log_login_attempt(
        db: AsyncSession,
        username: str,
        success: bool,
        ip_address: str,
        user_agent: Optional[str] = None,
        error_message: Optional[str] = None
    ):
        """Log login attempt"""
        event_type = AuditEventType.LOGIN if success else AuditEventType.LOGIN_FAILED
        severity = AuditSeverity.INFO if success else AuditSeverity.WARNING
        
        await AuditLogger.log_event(
            db=db,
            event_type=event_type,
            severity=severity,
            username=username,
            ip_address=ip_address,
            user_agent=user_agent,
            action=f"Login {'successful' if success else 'failed'} for {username}",
            status="success" if success else "failure",
            error_message=error_message
        )
    
    @staticmethod
    async def log_data_access(
        db: AsyncSession,
        user_id: int,
        resource_type: str,
        resource_id: str,
        action: str,
        ip_address: Optional[str] = None
    ):
        """Log data access event"""
        await AuditLogger.log_event(
            db=db,
            event_type=AuditEventType.DATA_VIEWED,
            user_id=user_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            ip_address=ip_address
        )
    
    @staticmethod
    async def log_data_modification(
        db: AsyncSession,
        user_id: int,
        resource_type: str,
        resource_id: str,
        action: str,
        old_value: Optional[Dict] = None,
        new_value: Optional[Dict] = None
    ):
        """Log data modification event"""
        event_type_map = {
            "create": AuditEventType.DATA_CREATED,
            "update": AuditEventType.DATA_UPDATED,
            "delete": AuditEventType.DATA_DELETED,
        }
        
        event_type = event_type_map.get(action.lower(), AuditEventType.DATA_UPDATED)
        
        await AuditLogger.log_event(
            db=db,
            event_type=event_type,
            user_id=user_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value
        )
    
    @staticmethod
    async def log_security_event(
        db: AsyncSession,
        event_type: AuditEventType,
        description: str,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict] = None
    ):
        """Log security-related event"""
        await AuditLogger.log_event(
            db=db,
            event_type=event_type,
            severity=AuditSeverity.WARNING,
            user_id=user_id,
            ip_address=ip_address,
            description=description,
            metadata=metadata
        )
    
    @staticmethod
    async def search_audit_logs(
        db: AsyncSession,
        user_id: Optional[int] = None,
        event_type: Optional[AuditEventType] = None,
        severity: Optional[AuditSeverity] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ):
        """Search audit logs with filters"""
        from sqlalchemy import select
        
        stmt = select(AuditLog)
        
        if user_id:
            stmt = stmt.where(AuditLog.user_id == user_id)
        if event_type:
            stmt = stmt.where(AuditLog.event_type == event_type)
        if severity:
            stmt = stmt.where(AuditLog.severity == severity)
        if start_date:
            stmt = stmt.where(AuditLog.timestamp >= start_date)
        if end_date:
            stmt = stmt.where(AuditLog.timestamp <= end_date)
        
        stmt = stmt.order_by(AuditLog.timestamp.desc()).limit(limit)
        
        result = await db.execute(stmt)
        return result.scalars().all()


class ComplianceReporter:
    """Generate compliance reports from audit logs"""
    
    @staticmethod
    async def generate_user_activity_report(
        db: AsyncSession,
        user_id: int,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """Generate comprehensive user activity report"""
        from sqlalchemy import select, func
        
        # Total events
        total_stmt = select(func.count(AuditLog.id)).where(
            AuditLog.user_id == user_id,
            AuditLog.timestamp.between(start_date, end_date)
        )
        total_result = await db.execute(total_stmt)
        total_events = total_result.scalar() or 0
        
        # Events by type
        type_stmt = select(
            AuditLog.event_type,
            func.count(AuditLog.id).label('count')
        ).where(
            AuditLog.user_id == user_id,
            AuditLog.timestamp.between(start_date, end_date)
        ).group_by(AuditLog.event_type)
        
        type_result = await db.execute(type_stmt)
        events_by_type = {row[0].value: row[1] for row in type_result.fetchall()}
        
        # Security events
        security_stmt = select(AuditLog).where(
            AuditLog.user_id == user_id,
            AuditLog.timestamp.between(start_date, end_date),
            AuditLog.severity.in_([AuditSeverity.WARNING, AuditSeverity.ERROR, AuditSeverity.CRITICAL])
        ).order_by(AuditLog.timestamp.desc()).limit(50)
        
        security_result = await db.execute(security_stmt)
        security_events = security_result.scalars().all()
        
        return {
            "user_id": user_id,
            "report_period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "summary": {
                "total_events": total_events,
                "events_by_type": events_by_type,
                "security_events_count": len(security_events)
            },
            "security_events": [
                {
                    "event_type": evt.event_type.value,
                    "severity": evt.severity.value,
                    "description": evt.description,
                    "timestamp": evt.timestamp.isoformat()
                }
                for evt in security_events
            ]
        }
