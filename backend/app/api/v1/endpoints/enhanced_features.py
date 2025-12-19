"""
Enhanced Features API Endpoints
Notifications, Social Sharing, PDF Reports, Mobile APIs
"""

from fastapi import APIRouter, Depends, HTTPException, Response, Query
from typing import Optional, List
from pydantic import BaseModel
import logging

from app.core.security import get_current_user
from app.core.i18n import Language
from app.models.models import User
from app.services.notifications.notification_service import notification_service
from app.services.sharing.social_sharing import social_sharing_service
from app.services.reports.pdf_generator import pdf_report_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/enhanced", tags=["Enhanced Features V5"])


# ==================== NOTIFICATIONS ====================

@router.get("/notifications")
async def get_notifications(
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_user)
):
    """
    Get user notifications
    """
    try:
        notifications = await notification_service.get_user_notifications(
            user_id=current_user.id,
            limit=limit,
            unread_only=unread_only
        )
        
        return {
            "success": True,
            "notifications": notifications,
            "total": len(notifications),
            "unread_count": sum(1 for n in notifications if not n.get("read", False))
        }
    except Exception as e:
        logger.error(f"Failed to fetch notifications: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Mark notification as read
    """
    try:
        success = await notification_service.mark_as_read(notification_id)
        
        if success:
            return {"success": True, "message": "Notification marked as read"}
        else:
            raise HTTPException(status_code=404, detail="Notification not found")
    except Exception as e:
        logger.error(f"Failed to mark notification as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SOCIAL SHARING ====================

class ShareRequest(BaseModel):
    prediction: dict
    platform: str = "general"  # whatsapp, twitter, facebook, instagram, general
    language: Optional[str] = "en"


@router.post("/share/generate")
async def generate_share_content(
    request: ShareRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate shareable content for social media
    Supports: WhatsApp, Twitter, Facebook, Instagram
    Languages: English, Marathi (mr), Hindi (hi)
    """
    try:
        lang = Language.MARATHI if request.language == "mr" else Language.HINDI if request.language == "hi" else Language.ENGLISH
        
        share_data = social_sharing_service.generate_share_text(
            prediction=request.prediction,
            language=lang,
            platform=request.platform
        )
        
        return {
            "success": True,
            "share_content": share_data
        }
    except Exception as e:
        logger.error(f"Failed to generate share content: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/share/links")
async def generate_share_links(
    request: ShareRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate direct share links for all platforms
    """
    try:
        lang = Language.MARATHI if request.language == "mr" else Language.HINDI if request.language == "hi" else Language.ENGLISH
        
        links = {
            "whatsapp": social_sharing_service.generate_whatsapp_link(request.prediction, lang),
            "twitter": social_sharing_service.generate_twitter_link(request.prediction, lang),
            "facebook": social_sharing_service.generate_facebook_link(request.prediction, lang),
        }
        
        return {
            "success": True,
            "links": links
        }
    except Exception as e:
        logger.error(f"Failed to generate share links: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/share/image")
async def generate_share_image(
    request: ShareRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate shareable image for Instagram stories, etc.
    """
    try:
        lang = Language.MARATHI if request.language == "mr" else Language.HINDI if request.language == "hi" else Language.ENGLISH
        
        image_data = social_sharing_service.generate_share_image(
            prediction=request.prediction,
            language=lang
        )
        
        return {
            "success": True,
            "image_data": image_data
        }
    except Exception as e:
        logger.error(f"Failed to generate share image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PDF REPORTS ====================

class PDFReportRequest(BaseModel):
    predictions: List[dict]
    language: Optional[str] = "en"
    include_ml_analysis: bool = True


@router.post("/reports/pdf")
async def generate_pdf_report(
    request: PDFReportRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate PDF report with predictions
    Supports: English, Marathi (mr), Hindi (hi)
    """
    try:
        lang = Language.MARATHI if request.language == "mr" else Language.HINDI if request.language == "hi" else Language.ENGLISH
        
        # Get user profile (mock for now)
        user_profile = {
            "name": current_user.email,  # Would fetch actual profile
            "birth_date": "1990-01-01",
            "birth_place": "Mumbai, India"
        }
        
        pdf_data = await pdf_report_service.generate_prediction_report(
            user_profile=user_profile,
            predictions=request.predictions,
            language=lang,
            include_ml_analysis=request.include_ml_analysis
        )
        
        # Return PDF file
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=predictions_report_{lang}.pdf"
            }
        )
    except Exception as e:
        logger.error(f"Failed to generate PDF report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== MOBILE APP APIs ====================

@router.get("/mobile/config")
async def get_mobile_config(
    current_user: User = Depends(get_current_user)
):
    """
    Get mobile app configuration
    """
    return {
        "success": True,
        "config": {
            "api_version": "v1",
            "app_version": "5.0.0",
            "features": {
                "predictions": True,
                "notifications": True,
                "sharing": True,
                "pdf_reports": True,
                "multi_language": True
            },
            "languages": [
                {"code": "en", "name": "English", "native_name": "English"},
                {"code": "mr", "name": "Marathi", "native_name": "मराठी"},
                {"code": "hi", "name": "Hindi", "native_name": "हिंदी"}
            ],
            "share_platforms": ["whatsapp", "twitter", "facebook", "instagram"],
            "notification_types": ["email", "sms", "push", "in_app"]
        }
    }


@router.get("/mobile/dashboard")
async def get_mobile_dashboard(
    language: str = Query("en"),
    current_user: User = Depends(get_current_user)
):
    """
    Get optimized dashboard data for mobile app
    """
    try:
        # Get recent notifications
        notifications = await notification_service.get_user_notifications(
            user_id=current_user.id,
            limit=5,
            unread_only=True
        )
        
        return {
            "success": True,
            "dashboard": {
                "user": {
                    "id": current_user.id,
                    "email": current_user.email
                },
                "notifications": {
                    "recent": notifications[:5],
                    "unread_count": len([n for n in notifications if not n.get("read")])
                },
                "quick_actions": [
                    {"label": "Generate Predictions", "action": "generate_predictions", "icon": "sparkles"},
                    {"label": "View Chart", "action": "view_chart", "icon": "chart"},
                    {"label": "Share", "action": "share", "icon": "share"},
                    {"label": "Download PDF", "action": "download_pdf", "icon": "download"}
                ]
            }
        }
    except Exception as e:
        logger.error(f"Failed to fetch mobile dashboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mobile/device/register")
async def register_mobile_device(
    device_token: str,
    platform: str,  # ios, android
    current_user: User = Depends(get_current_user)
):
    """
    Register mobile device for push notifications
    """
    # In production, store device token in database
    return {
        "success": True,
        "message": "Device registered successfully",
        "device_token": device_token,
        "platform": platform
    }
