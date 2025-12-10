"""
Astor AI Version Information
"""

__version__ = "2.0.0"
__version_info__ = (2, 0, 0)

# Release metadata
RELEASE_DATE = "2025-12-10"
RELEASE_NAME = "Enterprise Launch"
API_VERSION = "v1"

# Feature flags for version
FEATURES = {
    "life_events_prediction": True,
    "advanced_vedic": True,
    "yoga_detection": True,
    "ai_interpretations": True,
    "compatibility_analysis": True,
    "numerology": True,
    "vision_ai": True,
    "pdf_reports": True,
    "transit_alerts": True,
    "payment_integration": True,
    "video_consultations": True,
    "rag_engine": True,
    "multi_llm_support": True,
}

# Minimum versions for dependencies
MIN_PYTHON_VERSION = (3, 11)
MIN_POSTGRES_VERSION = (15, 0)
MIN_REDIS_VERSION = (7, 0)

def get_version() -> str:
    """Return the version string."""
    return __version__

def get_version_info() -> dict:
    """Return detailed version information."""
    return {
        "version": __version__,
        "version_info": __version_info__,
        "release_date": RELEASE_DATE,
        "release_name": RELEASE_NAME,
        "api_version": API_VERSION,
        "features": FEATURES,
    }
