"""Pydantic schemas for API requests and responses"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


# Enums
class UserRoleEnum(str, Enum):
    SEEKER = "seeker"
    ASTROLOGER = "astrologer"
    ADMIN = "admin"


class TOBAccuracyEnum(str, Enum):
    EXACT = "exact"
    APPROXIMATE = "approximate"
    UNKNOWN = "unknown"


class ChartSystemEnum(str, Enum):
    VEDIC = "vedic"
    WESTERN = "western"


class HouseSystemEnum(str, Enum):
    PLACIDUS = "placidus"
    WHOLE_SIGN = "whole_sign"
    KOCH = "koch"
    EQUAL = "equal"


class AyanamshaEnum(str, Enum):
    LAHIRI = "lahiri"
    RAMAN = "raman"
    KRISHNAMURTI = "krishnamurti"
    YUKTESHWAR = "yukteshwar"


# Authentication Schemas

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: UserRoleEnum = UserRoleEnum.SEEKER
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one digit")
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one uppercase letter")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    role: UserRoleEnum
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Profile Schemas

class ProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    date_of_birth: str = Field(..., description="YYYY-MM-DD")
    time_of_birth: str = Field(..., description="HH:MM:SS in 24hr format")
    tob_accuracy: TOBAccuracyEnum = TOBAccuracyEnum.APPROXIMATE
    birthplace: str = Field(..., min_length=1)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timezone: Optional[str] = None
    preferred_system: ChartSystemEnum = ChartSystemEnum.VEDIC
    language: str = "en"


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    preferred_system: Optional[ChartSystemEnum] = None
    language: Optional[str] = None


class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    dob_ts_utc: datetime
    tob_accuracy: TOBAccuracyEnum
    birthplace_text: str
    latitude: float
    longitude: float
    timezone: str
    preferred_system: ChartSystemEnum
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Chart Schemas

class ChartOptions(BaseModel):
    house_system: HouseSystemEnum = HouseSystemEnum.PLACIDUS
    ayanamsha: AyanamshaEnum = AyanamshaEnum.LAHIRI
    include_divisional: List[str] = Field(default_factory=list)
    include_dashas: bool = True
    include_transits: bool = False


class ChartCreate(BaseModel):
    profile_id: Optional[UUID] = None  # If None, uses user's first profile
    system: ChartSystemEnum = ChartSystemEnum.VEDIC
    options: Optional[ChartOptions] = None


class ChartResponse(BaseModel):
    id: UUID
    profile_id: UUID
    system: ChartSystemEnum
    json_payload: Dict[str, Any]
    hash_key: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# AI Interpretation Schemas

class InterpretationRequest(BaseModel):
    chart_id: UUID
    interpretation_type: str = Field(..., description="natal|transit|dasha")
    language: str = "en"
    include_remedies: bool = True


class InterpretationResponse(BaseModel):
    id: UUID
    chart_id: UUID
    interpretation: Dict[str, Any]
    confidence_score: Optional[float] = None
    created_at: datetime


# Compatibility Schemas

class CompatibilityRequest(BaseModel):
    chart_a_id: UUID
    chart_b_id: UUID
    system: ChartSystemEnum = ChartSystemEnum.VEDIC
    include_ai_summary: bool = True


class CompatibilityResponse(BaseModel):
    id: UUID
    chart_a_id: UUID
    chart_b_id: UUID
    system: ChartSystemEnum
    guna_score: Optional[int] = None
    synastry_score: Optional[float] = None
    ai_summary: Optional[str] = None
    raw_json: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Numerology Schemas

class NumerologyRequest(BaseModel):
    profile_id: Optional[UUID] = None  # If None, uses user's first profile
    full_name: str
    system: str = Field(default="pythagorean", pattern="^(pythagorean|chaldean)$")


class NumerologyResponse(BaseModel):
    id: UUID
    profile_id: UUID
    system: str
    json_result: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Report Schemas

class ReportCreate(BaseModel):
    chart_id: Optional[UUID] = None
    report_type: str = Field(..., pattern="^(natal|transit|compat|numerology)$")
    theme: str = Field(default="classic", pattern="^(classic|minimal|festival)$")
    include_charts: bool = True
    include_interpretations: bool = True


class ReportResponse(BaseModel):
    id: UUID
    chart_id: Optional[UUID] = None
    type: str
    theme: str
    file_url: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Transit Alert Schemas

class TransitWatchCreate(BaseModel):
    profile_id: UUID
    rule: str = Field(..., description="Transit rule description")
    start_date: datetime
    end_date: datetime


class TransitWatchResponse(BaseModel):
    id: UUID
    profile_id: UUID
    rule: str
    window_start: datetime
    window_end: datetime
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Generic Response

class MessageResponse(BaseModel):
    message: str
    detail: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    type: Optional[str] = None


# Additional Schemas for New Endpoints

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_datetime: Optional[datetime] = None
    birth_latitude: Optional[float] = None
    birth_longitude: Optional[float] = None
    birth_place: Optional[str] = None
    timezone: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)


class TransitWatchRequest(BaseModel):
    chart_id: int
    transit_type: str = "major"


class BiometricReadingResponse(BaseModel):
    id: UUID
    user_id: UUID
    reading_type: str
    analysis_data: Dict[str, Any]
    created_at: datetime
    expires_at: datetime
    
    class Config:
        from_attributes = True


class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    provider: str = "stripe"
    description: Optional[str] = None


class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_id: str


class SubscriptionRequest(BaseModel):
    plan_name: str
    provider: str = "stripe"
    trial_days: int = 0


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan_name: str
    status: str
    provider: str
    current_period_start: datetime
    current_period_end: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# Consultation Schemas

class SlotCreateRequest(BaseModel):
    start_datetime: datetime
    end_datetime: datetime
    slot_duration_minutes: int = 30
    timezone: str = "UTC"


class SlotResponse(BaseModel):
    id: int
    astrologer_id: int
    start_time: datetime
    end_time: datetime
    is_available: bool
    timezone: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class BookingCreateRequest(BaseModel):
    slot_id: int
    consultation_type: str = "general"
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    slot_id: Optional[int]
    astrologer_id: int
    seeker_id: int
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: Optional[datetime]
    actual_end: Optional[datetime]
    duration_minutes: Optional[int]
    consultation_type: str
    status: str
    video_room_url: Optional[str]
    payment_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class VideoTokenResponse(BaseModel):
    token: str
    room_url: str
    room_name: str
    expires: str
    is_moderator: bool
    provider: str


