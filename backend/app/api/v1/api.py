"""API Router aggregating all endpoints"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    charts,
    predictions,
    # interpretations,  # Temporarily disabled - needs fixes
    # compatibility,  # Temporarily disabled - missing model
    # numerology,  # Temporarily disabled
    # reports,  # Temporarily disabled
    # payments,  # Temporarily disabled
    # transits,  # Temporarily disabled
    # vision,  # Temporarily disabled
    users,
    # consultations  # Temporarily disabled
)

api_router = APIRouter()

# Authentication & Users
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Astrology Services
api_router.include_router(charts.router, prefix="/charts", tags=["Charts"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["Life Events Prediction"])
# api_router.include_router(interpretations.router, prefix="/interpretations", tags=["AI Interpretations"])
# api_router.include_router(compatibility.router, prefix="/compatibility", tags=["Compatibility"])
# api_router.include_router(numerology.router, prefix="/numerology", tags=["Numerology"])

# # Reports & Transits
# api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
# api_router.include_router(transits.router, prefix="/transits", tags=["Transits"])

# # Vision AI
# api_router.include_router(vision.router, prefix="/vision", tags=["Vision AI"])

# # Payments & Subscriptions
# api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])

# # Consultations
# api_router.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])

