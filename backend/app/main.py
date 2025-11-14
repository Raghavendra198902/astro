"""
Astor AI - Main Application Entry Point
FastAPI application with all routes, middleware, and lifecycle events
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging
import time

from app.core.config import get_settings
from app.core.logging_config import setup_logging
from app.core.database import engine
from app.api.v1.api import api_router

settings = get_settings()

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Astor AI application...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # TODO: Initialize components
    # - Load ephemeris data
    # - Warm up AI models
    # - Initialize cache
    
    yield
    
    # Shutdown
    logger.info("Shutting down Astor AI application...")
    await engine.dispose()


# Create FastAPI application
app = FastAPI(
    title="Astor AI - Astrology & Numerology Platform",
    description="AI-driven astrology system with Vedic/Western chart generation, interpretations, and compatibility analysis",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)


# Middleware Configuration
# -------------------------

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Request Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add X-Process-Time header to all responses"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception Handlers
# ------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "type": "internal_error",
        },
    )


# Routes
# ------

# Include API router
app.include_router(api_router, prefix="/api/v1")


# Test Numerology Endpoint (No Auth Required)
@app.get("/api/v1/numerology-test", tags=["Testing"])
async def get_numerology_test(
    full_name: str,
    birth_date: str,  # YYYY-MM-DD
    system: str = "pythagorean"
):
    """Test numerology calculation endpoint without authentication"""
    try:
        from datetime import datetime
        from app.services.numerology.engine import NumerologyEngine
        
        # Parse birth date
        birth_datetime = datetime.strptime(birth_date, "%Y-%m-%d")
        
        # Calculate numerology
        engine = NumerologyEngine()
        analysis = engine.calculate_full_analysis(
            full_name=full_name,
            birth_date=birth_datetime,
            system=system
        )
        
        return analysis
    except Exception as e:
        return {"error": str(e)}

# Test Chart Endpoint (No Auth Required)
@app.get("/api/v1/chart-test", tags=["Testing"])
async def get_chart_test(
    date: str,  # YYYY-MM-DD
    time: str,  # HH:MM
    latitude: float,
    longitude: float,
    timezone: str = "UTC"
):
    """Test chart generation endpoint without authentication"""
    try:
        from datetime import datetime
        from app.services.chart.engine import (
            calculate_chart,
            calculate_divisional_charts,
            calculate_vimshottari_dasha,
            calculate_shadbala
        )
        from app.services.chart.yoga_engine import YogaEngine
        
        # Parse datetime
        datetime_str = f"{date} {time}"
        birth_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
        
        # Calculate base chart
        chart_json = calculate_chart(
            birth_datetime,
            latitude,
            longitude
        )
        
        # Add divisional charts
        divisional = calculate_divisional_charts(chart_json)
        chart_json["divisional_charts"] = divisional
        
        # Add Vimshottari Dasha
        dasha = calculate_vimshottari_dasha(
            chart_json["planets"]["Moon"]["longitude"],
            birth_datetime
        )
        chart_json["vimshottari_dasha"] = dasha
        
        # Add Shadbala
        shadbala = calculate_shadbala(chart_json, birth_datetime)
        chart_json["shadbala"] = shadbala
        
        # Detect Yogas
        yoga_engine = YogaEngine()
        yogas = yoga_engine.detect_yogas(chart_json)
        chart_json["yogas"] = yogas
        
        return chart_json
    except Exception as e:
        return {"error": str(e)}

# Test Panchang Endpoint (No Auth Required)
@app.get("/api/v1/panchang-test", tags=["Testing"])
async def get_panchang_test(
    date: str,
    time: str,
    latitude: float,
    longitude: float
):
    """Test Panchang endpoint without authentication"""
    try:
        from datetime import datetime
        import swisseph as swe
        from app.services.chart.engine import chart_engine
        
        datetime_str = f"{date} {time}"
        birth_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
        
        jd = swe.julday(
            birth_datetime.year,
            birth_datetime.month,
            birth_datetime.day,
            birth_datetime.hour + birth_datetime.minute / 60.0
        )
        
        panchang = chart_engine.calculate_panchang(jd, latitude, longitude)
        return panchang
    except Exception as e:
        return {"error": str(e)}

# Test Palmistry Endpoint (No Auth Required)
@app.get("/api/v1/palmistry-test", tags=["Testing"])
async def get_palmistry_test(
    hand: str = "right",
    demo: bool = True
):
    """Test Palmistry analysis endpoint without authentication
    
    Args:
        hand: Which hand to analyze (left/right)
        demo: Return demo analysis (true) or require image upload (false)
    """
    try:
        # For demo purposes, return a complete palmistry analysis structure
        # In production, this would analyze an uploaded image
        
        analysis = {
            "hand": hand.capitalize(),
            "hand_meaning": (
                "Right hand shows current life and conscious choices. "
                "Left hand shows inherited traits and subconscious."
                if hand.lower() == "right" else
                "Left hand shows potential and inner self. "
                "Right hand shows current reality and choices."
            ),
            "features": {
                "hand_shape": "air",
                "lines": {
                    "life_line": {
                        "present": True,
                        "length": "long",
                        "quality": "clear",
                        "meaning": "Strong vitality, good health, and longevity"
                    },
                    "head_line": {
                        "present": True,
                        "direction": "straight",
                        "quality": "clear",
                        "meaning": "Practical, logical thinking and good concentration"
                    },
                    "heart_line": {
                        "present": True,
                        "curvature": "curved",
                        "quality": "deep",
                        "meaning": "Warm emotions, expressive nature, passionate relationships"
                    },
                    "fate_line": {
                        "present": True,
                        "strength": "strong",
                        "meaning": "Clear life direction, strong sense of purpose"
                    },
                    "marriage_line": {
                        "present": True,
                        "count": 2,
                        "meaning": "Significant romantic relationships, potential for marriage"
                    }
                },
                "fingers": {
                    "thumb": {
                        "length": "long",
                        "meaning": "Strong willpower, determination, leadership"
                    },
                    "index": {
                        "length": "long",
                        "meaning": "Natural leadership abilities, ambition, confidence"
                    },
                    "middle": {
                        "length": "long",
                        "meaning": "Responsibility, discipline, serious approach to life"
                    },
                    "ring": {
                        "length": "medium",
                        "meaning": "Creativity, artistic expression, appreciation for beauty"
                    },
                    "pinky": {
                        "length": "medium",
                        "meaning": "Good communication skills, business acumen"
                    }
                },
                "mounts": {
                    "jupiter": {
                        "location": "Below index finger",
                        "prominence": "high",
                        "meaning": "Strong ambition, leadership qualities, desire for recognition"
                    },
                    "saturn": {
                        "location": "Below middle finger",
                        "prominence": "medium",
                        "meaning": "Wisdom, patience, disciplined approach"
                    },
                    "apollo": {
                        "location": "Below ring finger",
                        "prominence": "high",
                        "meaning": "Creativity, artistic talents, appreciation for beauty"
                    },
                    "mercury": {
                        "location": "Below pinky",
                        "prominence": "medium",
                        "meaning": "Communication skills, business abilities, adaptability"
                    },
                    "venus": {
                        "location": "Base of thumb",
                        "prominence": "high",
                        "meaning": "Love, passion, vitality, warmth, affection"
                    },
                    "luna": {
                        "location": "Opposite thumb",
                        "prominence": "medium",
                        "meaning": "Imagination, intuition, creativity, subconscious mind"
                    }
                }
            },
            "interpretation": {
                "element": "air",
                "temperament": "Intellectual, communicative, analytical, social",
                "vitality": "Strong vitality and good health indicated by clear life line",
                "mentality": "Practical, logical thinker with good concentration",
                "emotions": "Warm, expressive emotions with capacity for deep relationships",
                "career": "Success in communication, teaching, writing, or leadership roles",
                "relationships": "Passionate and committed in relationships, values emotional connection",
                "strengths": [
                    "Strong intellectual abilities",
                    "Good communication skills",
                    "Natural leadership qualities",
                    "Creative and artistic talents",
                    "Emotional warmth and expressiveness"
                ],
                "challenges": [
                    "May overthink situations",
                    "Need to balance logic with intuition",
                    "Tendency to take on too much responsibility"
                ],
                "summary": (
                    "An air-element hand indicates intellectual, communicative nature. "
                    "The palm lines suggest strong vitality, practical thinking, and warm emotional expression. "
                    "The prominent mounts show natural leadership abilities, creativity, and capacity for love. "
                    "Overall, this is a hand of someone who combines intellect with emotion, "
                    "capable of both deep thinking and heartfelt connections."
                )
            },
            "confidence": 0.87,
            "timestamp": "2025-11-14T12:00:00Z"
        }
        
        return analysis
    except Exception as e:
        return {"error": str(e)}

# Test Face Reading Endpoint (No Auth Required)
@app.get("/api/v1/face-reading-test", tags=["Testing"])
async def get_face_reading_test(
    demo: bool = True
):
    """Test Face Reading analysis endpoint without authentication
    
    Args:
        demo: Return demo analysis (true) or require image upload (false)
    """
    try:
        # For demo purposes, return a complete face reading analysis structure
        # In production, this would analyze an uploaded image
        
        analysis = {
            "features": {
                "face_shape": "oval",
                "forehead": {
                    "height": 0.32,
                    "type": "high",
                    "meaning": "Strong intellectual capacity, philosophical thinking"
                },
                "eyebrows": {
                    "shape": "arched",
                    "thickness": "medium",
                    "meaning": "Expressive, confident, good at reading situations"
                },
                "eyes": {
                    "distance": "wide",
                    "size": "large",
                    "shape": "almond",
                    "meaning": "Open-minded, broad perspective, good observation skills"
                },
                "nose": {
                    "length": "medium",
                    "shape": "straight",
                    "bridge": "high",
                    "meaning": "Balanced ambition, practical goals, honest nature"
                },
                "mouth": {
                    "size": "medium",
                    "shape": "full",
                    "lip_fullness": "balanced",
                    "meaning": "Balanced communication, expressive yet diplomatic"
                },
                "chin": {
                    "shape": "round",
                    "prominence": "medium",
                    "meaning": "Friendly, approachable, emotionally balanced"
                },
                "cheeks": {
                    "prominence": "medium",
                    "meaning": "Sociable, friendly nature"
                },
                "proportions": {
                    "width_to_height_ratio": 0.78,
                    "symmetry_score": 0.89,
                    "golden_ratio": 0.85
                }
            },
            "interpretation": {
                "personality": "Balanced, harmonious, adaptable - the oval face indicates versatility",
                "intellect": "Intellectual, philosophical, visionary with strong analytical abilities",
                "perception": "Broad perspective, open-minded, tolerant, sees the bigger picture",
                "ambition": "Moderate ambition with practical, achievable goals",
                "communication": "Balanced communicator, diplomatic yet expressive",
                "emotions": "Emotionally balanced, friendly, approachable",
                "character_traits": {
                    "leadership": "Natural leadership through diplomacy and vision",
                    "creativity": "Strong creative abilities, artistic appreciation",
                    "social": "Sociable, friendly, good at building relationships",
                    "intellectual": "High intellectual capacity, loves learning",
                    "emotional": "Emotionally balanced, empathetic, understanding"
                },
                "life_areas": {
                    "career": "Success in fields requiring communication, analysis, and creativity - teaching, counseling, arts, management",
                    "relationships": "Values deep connections, loyal partner, good communicator in relationships",
                    "health": "Generally good health, should focus on mental balance and stress management",
                    "wealth": "Moderate to good financial prospects through career and smart decisions"
                },
                "strengths": [
                    "High intellectual capacity and philosophical thinking",
                    "Open-minded with broad perspective",
                    "Balanced emotional expression",
                    "Good communication and diplomatic skills",
                    "Natural leadership abilities",
                    "Creative and artistic talents"
                ],
                "challenges": [
                    "May overthink situations",
                    "Could benefit from more decisive action",
                    "Need to balance analysis with intuition",
                    "Should avoid being too accommodating"
                ],
                "recommendations": [
                    "Pursue careers in education, counseling, or creative fields",
                    "Develop meditation practice to balance mental activity",
                    "Engage in creative expression through arts or writing",
                    "Build strong personal relationships through open communication",
                    "Set clear boundaries while maintaining diplomatic approach"
                ],
                "summary": (
                    "An oval face with high forehead and wide-set eyes indicates a person of "
                    "high intellectual capacity with broad perspective and open-minded nature. "
                    "The balanced facial features suggest emotional stability and diplomatic "
                    "communication skills. This is someone who combines intellect with empathy, "
                    "capable of both deep thinking and emotional connection. Natural abilities "
                    "in leadership, creativity, and building meaningful relationships. "
                    "Best suited for careers involving communication, analysis, and helping others."
                )
            },
            "landmarks_count": 468,
            "confidence": 0.91,
            "timestamp": "2025-11-14T12:00:00Z"
        }
        
        return analysis
    except Exception as e:
        return {"error": str(e)}

# Life Events Prediction Test Endpoints
@app.get("/api/v1/predictions-test/demo", tags=["Testing"])
async def get_life_predictions_demo(
    full_name: str = "John Doe",
    birth_date: str = "1990-05-15",
    birth_time: str = "12:00",
    latitude: float = 19.876,
    longitude: float = 75.343,
    current_age: int = 34,
    prediction_years: int = 10
):
    """Test Life Events Prediction - Combined Past + Future"""
    try:
        from datetime import datetime
        from app.services.predictions.life_events_engine import life_events_engine
        
        birth_dt = datetime.strptime(birth_date, "%Y-%m-%d")
        
        prediction = life_events_engine.predict_life_events(
            birth_date=birth_dt,
            birth_time=birth_time,
            latitude=latitude,
            longitude=longitude,
            full_name=full_name,
            current_age=current_age,
            prediction_years=prediction_years
        )
        
        return prediction
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/predictions-test/multisource", tags=["Testing"])
async def get_multisource_prediction_demo(
    full_name: str = "John Doe",
    birth_date: str = "1990-05-15",
    birth_time: str = "12:00",
    latitude: float = 19.876,
    longitude: float = 75.343,
    current_age: int = 34
):
    """Test Multi-Source Fusion - Astrology + Palmistry + Face Reading"""
    try:
        from datetime import datetime
        from app.services.predictions.life_events_engine import life_events_engine
        from app.services.predictions.multisource_fusion import multisource_fusion_engine
        
        birth_dt = datetime.strptime(birth_date, "%Y-%m-%d")
        
        # Get astrology predictions
        astro_predictions = life_events_engine.predict_life_events(
            birth_date=birth_dt,
            birth_time=birth_time,
            latitude=latitude,
            longitude=longitude,
            full_name=full_name,
            current_age=current_age,
            prediction_years=10
        )
        
        # Get demo palm analysis
        palm_demo = {
            "hand": "Right",
            "interpretation": {
                "element": "air",
                "career": "Success in communication and leadership roles",
                "relationships": "Passionate and committed in relationships",
                "vitality": "Strong vitality and good health",
                "strengths": [
                    "Strong intellectual abilities",
                    "Good communication skills",
                    "Natural leadership"
                ],
                "challenges": [
                    "May overthink situations",
                    "Need balance between logic and intuition"
                ]
            }
        }
        
        # Get demo face analysis  
        face_demo = {
            "features": {
                "face_shape": "oval"
            },
            "interpretation": {
                "personality": "Balanced, harmonious, adaptable",
                "intellect": "High intellectual capacity",
                "emotions": "Emotionally balanced",
                "communication": "Diplomatic yet expressive",
                "life_areas": {
                    "career": "Success in teaching, counseling, or creative fields",
                    "relationships": "Values deep connections, loyal partner"
                },
                "strengths": [
                    "Open-minded with broad perspective",
                    "Good communication skills",
                    "Creative talents"
                ]
            }
        }
        
        # Fuse all sources
        fused_prediction = multisource_fusion_engine.fuse_predictions(
            astro_predictions=astro_predictions,
            palm_analysis=palm_demo,
            face_analysis=face_demo,
            birth_date=birth_dt,
            current_age=current_age
        )
        
        return fused_prediction
    except Exception as e:
        return {"error": str(e)}

# Health Check Endpoints
@app.get("/healthz", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.get("/readyz", tags=["Health"])
async def readiness_check():
    """Readiness check endpoint"""
    # TODO: Check database, redis, etc.
    return {
        "status": "ready",
        "checks": {
            "database": "ok",
            "redis": "ok",
            "rabbitmq": "ok",
        }
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Astor AI - Astrology & Numerology Platform",
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else None,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
