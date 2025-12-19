"""API Router aggregating all endpoints"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    charts,
    predictions,
    interpretations,  # ✅ Re-enabled
    compatibility,  # ✅ Re-enabled - service classes fixed
    numerology,  # ✅ Re-enabled - model refactored
    reports,  # ⚠️ Will gracefully fail if WeasyPrint missing
    payments,  # ✅ Re-enabled - models added
    transits,  # ✅ Re-enabled
    vision,  # ⚠️ Will gracefully fail if OpenCV missing
    users,
    consultations,  # ✅ Re-enabled - Subscription model added
    panchang,  # ✅ Hindu Panchang calendar
    enhanced_features,  # 🆕 V5.0 Enhanced features
    advanced_aggressive,  # 🔥 V5.0 AGGRESSIVE MODE
    analytics,  # 🏢 Enterprise analytics
    batch,  # 🏢 Batch processing
    websocket  # 🏢 Real-time WebSocket
)

api_router = APIRouter()

# Authentication & Users
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Astrology Services
api_router.include_router(charts.router, prefix="/charts", tags=["Charts"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["Life Events Prediction"])
api_router.include_router(interpretations.router, prefix="/interpretations", tags=["AI Interpretations"])
api_router.include_router(compatibility.router, prefix="/compatibility", tags=["Compatibility"])  # Re-enabled
api_router.include_router(numerology.router, prefix="/numerology", tags=["Numerology"])  # Re-enabled

# Reports & Transits
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(transits.router, prefix="/transits", tags=["Transits"])

# Vision AI
api_router.include_router(vision.router, prefix="/vision", tags=["Vision AI"])

# Payments & Subscriptions
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])

# Consultations
api_router.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])

# Panchang (Hindu Calendar)
api_router.include_router(panchang.router, prefix="/panchang", tags=["Panchang"])

# Enhanced Features V5.0
api_router.include_router(enhanced_features.router, prefix="/enhanced", tags=["Enhanced Features V5"])

# 🔥 Advanced Aggressive Mode (Neural ML + Caching + Performance)
api_router.include_router(advanced_aggressive.router, prefix="/advanced", tags=["Advanced Aggressive"])

# 🏢 Enterprise Features
api_router.include_router(analytics.router, prefix="/analytics", tags=["Enterprise Analytics"])
api_router.include_router(batch.router, prefix="/batch", tags=["Batch Processing"])
api_router.include_router(websocket.router, prefix="", tags=["WebSocket Real-time"])


