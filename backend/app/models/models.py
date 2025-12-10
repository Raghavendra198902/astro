"""
Database Models for Astor AI Platform
All SQLAlchemy ORM models with pgvector support
"""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, JSON,
    ForeignKey, Enum, Index, UniqueConstraint, CheckConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
import uuid
import enum

from app.core.database import Base


# Enums
class UserRole(str, enum.Enum):
    SEEKER = "seeker"
    ASTROLOGER = "astrologer"
    ADMIN = "admin"


class TOBAccuracy(enum.Enum):
    EXACT = "exact"
    APPROXIMATE = "approximate"
    UNKNOWN = "unknown"


class ChartSystem(enum.Enum):
    VEDIC = "vedic"
    WESTERN = "western"


class ReportType(str, enum.Enum):
    NATAL = "natal"
    TRANSIT = "transit"
    COMPATIBILITY = "compat"
    NUMEROLOGY = "numerology"


class ReportTheme(str, enum.Enum):
    CLASSIC = "classic"
    MINIMAL = "minimal"
    FESTIVAL = "festival"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class PlanType(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ASTROLOGER = "astrologer"


# Models

class User(Base):
    """User accounts"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, values_callable=lambda x: [e.value for e in x]), default=UserRole.SEEKER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profiles = relationship("Profile", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    
    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_role", "role"),
    )


class Profile(Base):
    """User profiles (multi-profile support)"""
    __tablename__ = "profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    dob_ts_utc = Column(DateTime(timezone=True), nullable=False)
    tob_accuracy = Column(Enum(TOBAccuracy, name="tob_accuracy", values_callable=lambda x: [e.value for e in x]), default=TOBAccuracy.APPROXIMATE, nullable=False)
    birthplace_text = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timezone = Column(String(100), nullable=False)
    preferred_system = Column(Enum(ChartSystem, name="chart_system", values_callable=lambda x: [e.value for e in x]), default=ChartSystem.VEDIC, nullable=False)
    language = Column(String(10), default="en", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profiles")
    charts = relationship("Chart", back_populates="profile", cascade="all, delete-orphan")
    transit_watches = relationship("TransitWatch", back_populates="profile")
    numerology_runs = relationship("NumerologyRun", back_populates="profile")
    
    __table_args__ = (
        Index("idx_profiles_user_id", "user_id"),
        Index("idx_profiles_dob", "dob_ts_utc"),
    )


class Chart(Base):
    """Generated birth charts"""
    __tablename__ = "charts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    system = Column(Enum(ChartSystem, name="chart_system", values_callable=lambda x: [e.value for e in x]), nullable=False)
    json_payload = Column(JSONB, nullable=False)
    hash_key = Column(String(64), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="charts")
    reports = relationship("Report", back_populates="chart")
    compat_requests_a = relationship(
        "CompatibilityRequest",
        foreign_keys="CompatibilityRequest.chart_a_id",
        back_populates="chart_a"
    )
    compat_requests_b = relationship(
        "CompatibilityRequest",
        foreign_keys="CompatibilityRequest.chart_b_id",
        back_populates="chart_b"
    )
    ai_runs = relationship("AIRun", back_populates="chart")
    
    __table_args__ = (
        Index("idx_charts_profile_id", "profile_id"),
        Index("idx_charts_hash_key", "hash_key"),
        Index("idx_charts_system", "system"),
    )


class TransitWatch(Base):
    """User transit subscriptions"""
    __tablename__ = "transit_watches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    rule = Column(String(500), nullable=False)
    window_start = Column(DateTime(timezone=True), nullable=False)
    window_end = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="transit_watches")
    
    __table_args__ = (
        Index("idx_transit_watches_profile_id", "profile_id"),
        Index("idx_transit_watches_status", "status"),
    )


class CompatibilityRequest(Base):
    """Compatibility analysis results"""
    __tablename__ = "compat_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chart_a_id = Column(UUID(as_uuid=True), ForeignKey("charts.id", ondelete="CASCADE"), nullable=False)
    chart_b_id = Column(UUID(as_uuid=True), ForeignKey("charts.id", ondelete="CASCADE"), nullable=False)
    system = Column(Enum(ChartSystem, name="chart_system"), nullable=False)
    raw_json = Column(JSONB, nullable=False)
    guna_score = Column(Integer, nullable=True)
    synastry_score = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    chart_a = relationship("Chart", foreign_keys=[chart_a_id], back_populates="compat_requests_a")
    chart_b = relationship("Chart", foreign_keys=[chart_b_id], back_populates="compat_requests_b")
    
    __table_args__ = (
        Index("idx_compat_requests_chart_a", "chart_a_id"),
        Index("idx_compat_requests_chart_b", "chart_b_id"),
    )


class Report(Base):
    """Generated reports"""
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chart_id = Column(UUID(as_uuid=True), ForeignKey("charts.id", ondelete="CASCADE"), nullable=True)
    type = Column(Enum(ReportType), nullable=False)
    theme = Column(Enum(ReportTheme), default=ReportTheme.CLASSIC, nullable=False)
    file_url = Column(String(1000), nullable=False)
    report_metadata = Column(JSONB, nullable=True)  # Renamed to avoid SQLAlchemy conflict
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    chart = relationship("Chart", back_populates="reports")
    
    __table_args__ = (
        Index("idx_reports_chart_id", "chart_id"),
        Index("idx_reports_type", "type"),
    )


class AIRun(Base):
    """AI interpretation runs with cost tracking"""
    __tablename__ = "ai_runs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chart_id = Column(UUID(as_uuid=True), ForeignKey("charts.id", ondelete="CASCADE"), nullable=True)
    input_hash = Column(String(64), nullable=False, index=True)
    prompt_template_id = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    output_tokens = Column(Integer, nullable=True)
    cost_meta = Column(JSONB, nullable=True)
    output_ref = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    user_rating = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    chart = relationship("Chart", back_populates="ai_runs")
    
    __table_args__ = (
        Index("idx_ai_runs_chart_id", "chart_id"),
        Index("idx_ai_runs_input_hash", "input_hash"),
        Index("idx_ai_runs_model", "model"),
        CheckConstraint("user_rating >= 1 AND user_rating <= 5", name="check_user_rating"),
    )


class Payment(Base):
    """Payment transactions"""
    __tablename__ = "payments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan = Column(Enum(PlanType), nullable=False)
    provider = Column(String(50), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    amount = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    txn_ref = Column(String(255), unique=True, nullable=False, index=True)
    payment_metadata = Column(JSONB, nullable=True)  # Renamed to avoid SQLAlchemy conflict
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="payments")
    
    __table_args__ = (
        Index("idx_payments_user_id", "user_id"),
        Index("idx_payments_status", "status"),
        Index("idx_payments_txn_ref", "txn_ref"),
    )


class Subscription(Base):
    """User subscriptions"""
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan = Column(Enum(PlanType), nullable=False)
    status = Column(String(20), default="active", nullable=False)
    provider = Column(String(50), nullable=False)
    provider_subscription_id = Column(String(255), nullable=True)
    current_period_start = Column(DateTime(timezone=True), nullable=False)
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    cancel_at_period_end = Column(Boolean, default=False, nullable=False)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    trial_start = Column(DateTime(timezone=True), nullable=True)
    trial_end = Column(DateTime(timezone=True), nullable=True)
    subscription_metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    
    __table_args__ = (
        Index("idx_subscriptions_user_id", "user_id"),
        Index("idx_subscriptions_status", "status"),
        Index("idx_subscriptions_current_period_end", "current_period_end"),
        CheckConstraint("status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')", name="check_subscription_status"),
    )


class Transaction(Base):
    """Payment transactions for detailed tracking"""
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    provider = Column(String(50), nullable=False)
    provider_transaction_id = Column(String(255), nullable=True)
    transaction_type = Column(String(50), default="charge", nullable=False)
    description = Column(Text, nullable=True)
    failure_reason = Column(Text, nullable=True)
    transaction_metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    subscription = relationship("Subscription")
    
    __table_args__ = (
        Index("idx_transactions_user_id", "user_id"),
        Index("idx_transactions_subscription_id", "subscription_id"),
        Index("idx_transactions_status", "status"),
        Index("idx_transactions_created_at", "created_at"),
        CheckConstraint("transaction_type IN ('charge', 'refund', 'adjustment')", name="check_transaction_type"),
    )


class AuditLog(Base):
    """Audit log for compliance"""
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String(100), nullable=False)
    target = Column(String(255), nullable=True)
    meta = Column(JSONB, nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("idx_audit_logs_actor_id", "actor_id"),
        Index("idx_audit_logs_action", "action"),
        Index("idx_audit_logs_timestamp", "timestamp"),
    )


class KnowledgeBaseDoc(Base):
    """RAG knowledge base documents"""
    __tablename__ = "kb_docs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(1536), nullable=True)  # OpenAI text-embedding-3-small dimension
    source_ref = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    language = Column(String(10), default="en", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("idx_kb_docs_category", "category"),
        Index("idx_kb_docs_language", "language"),
        # Create vector similarity index
        Index(
            "idx_kb_docs_embedding",
            "embedding",
            postgresql_using="ivfflat",
            postgresql_with={"lists": 100},
            postgresql_ops={"embedding": "vector_cosine_ops"}
        ),
    )


class NumerologyRun(Base):
    """Numerology analysis results"""
    __tablename__ = "numerology_runs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    system = Column(String(50), nullable=False)  # pythagorean|chaldean
    input_hash = Column(String(64), nullable=False, index=True)
    json_result = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="numerology_runs")
    
    __table_args__ = (
        Index("idx_numerology_runs_profile_id", "profile_id"),
        Index("idx_numerology_runs_system", "system"),
    )


class BiometricFace(Base):
    """Face reading biometric data (privacy-first)"""
    __tablename__ = "biometrics_faces"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    landmarks_hash = Column(String(64), nullable=False)
    features_json = Column(JSONB, nullable=False)
    consent_flag = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("idx_biometrics_faces_profile_id", "profile_id"),
        Index("idx_biometrics_faces_expires_at", "expires_at"),
    )


class BiometricPalm(Base):
    """Palm reading biometric data (privacy-first)"""
    __tablename__ = "biometrics_palms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    features_json = Column(JSONB, nullable=False)
    consent_flag = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("idx_biometrics_palms_profile_id", "profile_id"),
        Index("idx_biometrics_palms_expires_at", "expires_at"),
    )


class ConsultationSlot(Base):
    """Astrologer availability slots"""
    __tablename__ = "consultation_slots"
    
    id = Column(Integer, primary_key=True)
    astrologer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)
    timezone = Column(String(50), default="UTC", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    astrologer = relationship("User", foreign_keys=[astrologer_id])
    
    __table_args__ = (
        Index("idx_consultation_slots_astrologer", "astrologer_id"),
        Index("idx_consultation_slots_start_time", "start_time"),
        Index("idx_consultation_slots_available", "is_available", "is_active"),
    )


class ConsultationBooking(Base):
    """Consultation bookings"""
    __tablename__ = "consultation_bookings"
    
    id = Column(Integer, primary_key=True)
    slot_id = Column(Integer, ForeignKey("consultation_slots.id", ondelete="SET NULL"), nullable=True)
    astrologer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seeker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    consultation_type = Column(String(50), default="general", nullable=False)
    status = Column(String(20), default="scheduled", nullable=False)
    notes = Column(Text, nullable=True)
    session_notes = Column(Text, nullable=True)
    video_room_url = Column(String(255), nullable=True)
    video_room_name = Column(String(100), nullable=True)
    recording_url = Column(String(255), nullable=True)
    payment_verified = Column(Boolean, default=False, nullable=False)
    cancellation_reason = Column(Text, nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    slot = relationship("ConsultationSlot")
    astrologer = relationship("User", foreign_keys=[astrologer_id])
    seeker = relationship("User", foreign_keys=[seeker_id])
    
    __table_args__ = (
        Index("idx_consultation_bookings_astrologer", "astrologer_id"),
        Index("idx_consultation_bookings_seeker", "seeker_id"),
        Index("idx_consultation_bookings_status", "status"),
        Index("idx_consultation_bookings_scheduled_start", "scheduled_start"),
        CheckConstraint("status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')", name="check_booking_status"),
    )


class PredictionHistory(Base):
    """Prediction history for life events"""
    __tablename__ = "prediction_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=True)
    
    # Request parameters
    full_name = Column(String(200), nullable=False)
    birth_date = Column(DateTime(timezone=True), nullable=False)
    birth_time = Column(String(10), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    current_age = Column(Integer, nullable=False)
    prediction_years = Column(Integer, nullable=False)
    
    # Results
    prediction_data = Column(JSONB, nullable=False)  # Full prediction result
    past_events_count = Column(Integer, default=0)
    future_events_count = Column(Integer, default=0)
    risk_periods_count = Column(Integer, default=0)
    accuracy_score = Column(Float, nullable=True)
    
    # Metadata
    computation_time_seconds = Column(Float, nullable=True)
    from_cache = Column(Boolean, default=False)
    cache_key = Column(String(100), nullable=True)
    request_id = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accessed_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    profile = relationship("Profile")
    
    __table_args__ = (
        Index("idx_prediction_history_user", "user_id"),
        Index("idx_prediction_history_profile", "profile_id"),
        Index("idx_prediction_history_created", "created_at"),
        Index("idx_prediction_history_cache_key", "cache_key"),
    )


class BiometricReading(Base):
    """Face and palm reading biometric analysis"""
    __tablename__ = "biometric_readings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reading_type = Column(String(50), nullable=False)  # face|palm
    analysis_data = Column(JSONB, nullable=False)
    user_consent = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)  # Data retention policy
    
    # Relationships
    user = relationship("User")
    
    __table_args__ = (
        Index("idx_biometric_readings_user", "user_id"),
        Index("idx_biometric_readings_type", "reading_type"),
        Index("idx_biometric_readings_expires", "expires_at"),
    )
