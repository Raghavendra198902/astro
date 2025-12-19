"""
Core Configuration Module
Loads and validates all application settings from environment variables
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import List, Literal
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
    
    # Environment
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = Field(..., description="PostgreSQL connection string")
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = Field(..., description="Redis connection string")
    REDIS_CACHE_TTL: int = 3600
    
    # RabbitMQ
    RABBITMQ_URL: str = Field(..., description="RabbitMQ connection string")
    
    # Security
    SECRET_KEY: str = Field(..., min_length=32, description="Secret key for JWT")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8
    
    # CORS - Allow all origins for development
    CORS_ORIGINS: List[str] = ["*"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # AI Configuration
    LLM_PROVIDER: Literal["openai", "anthropic", "ollama", "local"] = "openai"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4-turbo-preview"
    LLM_TEMPERATURE: float = 0.5
    LLM_MAX_TOKENS: int = 2000
    LLM_TIMEOUT: int = 60
    
    # RAG Configuration
    ENABLE_RAG: bool = True
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    VECTOR_SIMILARITY_THRESHOLD: float = 0.7
    RAG_TOP_K: int = 5
    
    # Ephemeris Configuration
    EPHEMERIS_PATH: str = "/app/ephemeris/data"
    EPHEMERIS_CACHE_ENABLED: bool = True
    DEFAULT_AYANAMSHA: Literal["lahiri", "raman", "krishnamurti", "yukteshwar"] = "lahiri"
    
    # Chart Configuration
    DEFAULT_HOUSE_SYSTEM: Literal["placidus", "whole_sign", "koch", "equal"] = "placidus"
    DEFAULT_ORBS_CONJUNCTION: float = 8.0
    DEFAULT_ORBS_OPPOSITION: float = 8.0
    DEFAULT_ORBS_TRINE: float = 8.0
    DEFAULT_ORBS_SQUARE: float = 7.0
    DEFAULT_ORBS_SEXTILE: float = 6.0
    
    # Timezone & Geocoding
    GEOCODING_PROVIDER: Literal["offline", "google", "mapbox"] = "offline"
    GEOCODING_API_KEY: str = ""
    TIMEZONE_DATABASE_PATH: str = "/app/data/timezones.db"
    
    # Payments
    PAYMENT_PROVIDER: str = "stripe"  # stripe or razorpay
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRO_PRICE_ID: str = "price_test_pro"  # Stripe price ID for Pro plan
    STRIPE_ASTROLOGER_PRICE_ID: str = "price_test_astrologer"  # Stripe price ID for Astrologer plan
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_PRO_PLAN_ID: str = "plan_test_pro"  # Razorpay plan ID for Pro
    RAZORPAY_ASTROLOGER_PLAN_ID: str = "plan_test_astrologer"  # Razorpay plan ID for Astrologer
    PAYMENT_CURRENCY: str = "INR"
    ENABLE_GST: bool = True
    GST_RATE: float = 18.0
    
    # Plans & Pricing
    PLAN_FREE_CHARTS_LIMIT: int = 3
    PLAN_FREE_REPORTS_LIMIT: int = 1
    PLAN_PRO_MONTHLY_PRICE: int = 999
    PLAN_PRO_YEARLY_PRICE: int = 9999
    PLAN_ASTROLOGER_MONTHLY_PRICE: int = 2999
    
    # OAuth Configuration
    GOOGLE_CLIENT_ID: str = Field(default="test_client_id")
    GOOGLE_CLIENT_SECRET: str = Field(default="test_secret")
    GOOGLE_REDIRECT_URI: str = Field(default="http://192.168.0.102/api/v1/auth/google/callback")
    MICROSOFT_CLIENT_ID: str = Field(default="test_client_id")
    MICROSOFT_CLIENT_SECRET: str = Field(default="test_secret")
    MICROSOFT_REDIRECT_URI: str = Field(default="http://192.168.0.102/api/v1/auth/microsoft/callback")
    FRONTEND_URL: str = Field(default="http://192.168.0.102:3000")
    
    # Vision AI
    ENABLE_VISION_AI: bool = True
    VISION_ON_DEVICE_PREFERRED: bool = True
    VISION_MODEL_FACE: str = "mediapipe"
    VISION_MODEL_PALM: str = "mediapipe"
    BIOMETRIC_RETENTION_DAYS: int = 30
    FACE_LANDMARK_COUNT: int = 468
    
    # Numerology
    ENABLE_NUMEROLOGY: bool = True
    DEFAULT_NUMEROLOGY_SYSTEM: Literal["pythagorean", "chaldean"] = "pythagorean"
    
    # Reports
    REPORT_GENERATOR: Literal["weasyprint", "pdfkit"] = "weasyprint"
    REPORT_DEFAULT_THEME: Literal["classic", "minimal", "festival"] = "classic"
    REPORT_STORAGE: Literal["local", "s3", "minio"] = "local"
    REPORT_WATERMARK_ENABLED: bool = True
    
    # S3 / MinIO
    S3_ENDPOINT_URL: str = "https://s3.amazonaws.com"
    S3_ACCESS_KEY_ID: str = ""
    S3_SECRET_ACCESS_KEY: str = ""
    S3_BUCKET_NAME: str = "astor-ai-reports"
    S3_REGION: str = "us-east-1"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@astorai.com"
    SMTP_FROM_NAME: str = "Astor AI"
    
    # Consultation
    ENABLE_CONSULTATIONS: bool = True
    WEBRTC_PROVIDER: Literal["agora", "twilio", "jitsi"] = "agora"
    WEBRTC_API_KEY: str = ""
    WEBRTC_API_SECRET: str = ""
    
    # Monitoring & Observability
    ENABLE_TELEMETRY: bool = True
    OTEL_EXPORTER_OTLP_ENDPOINT: str = "http://localhost:4317"
    OTEL_SERVICE_NAME: str = "astor-ai-backend"
    ENABLE_METRICS: bool = True
    ENABLE_TRACING: bool = True
    
    # Logging
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    LOG_FORMAT: Literal["json", "plain"] = "json"
    LOG_FILE_PATH: str = "/app/logs/app.log"
    
    # Sentry
    SENTRY_DSN: str = ""
    SENTRY_TRACES_SAMPLE_RATE: float = 0.1
    
    # Feature Flags
    FEATURE_RECTIFICATION: bool = False
    FEATURE_MUHURTA: bool = False
    FEATURE_MULTILANG: bool = False
    
    # Compliance
    ENABLE_AUDIT_LOG: bool = True
    ENABLE_DATA_EXPORT: bool = True
    GDPR_COMPLIANCE: bool = True
    COPPA_COMPLIANCE: bool = True


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get settings instance (for dependency injection)"""
    return settings
