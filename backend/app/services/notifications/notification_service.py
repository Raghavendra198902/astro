"""
Real-time Notification Service for Predictions
Supports email, SMS, and push notifications in multiple languages
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import logging
import json
from app.core.i18n import Language, get_translator

logger = logging.getLogger(__name__)


class NotificationType(str, Enum):
    """Notification types"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"


class NotificationPriority(str, Enum):
    """Notification priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class NotificationService:
    """
    Manages real-time notifications for predictions and events
    Supports multiple languages and delivery channels
    """
    
    def __init__(self):
        self.enabled = True
        self.notification_queue = []
        
    async def send_prediction_notification(
        self,
        user_id: int,
        prediction: Dict,
        notification_type: NotificationType = NotificationType.IN_APP,
        language: Language = Language.ENGLISH,
        priority: NotificationPriority = NotificationPriority.MEDIUM
    ) -> Dict:
        """
        Send notification about a new prediction
        """
        try:
            translator = get_translator(language)
            
            # Build notification content
            notification = {
                "id": f"pred_{user_id}_{datetime.now().timestamp()}",
                "user_id": user_id,
                "type": notification_type,
                "priority": priority,
                "language": language,
                "title": self._get_notification_title(prediction, translator),
                "message": self._get_notification_message(prediction, translator),
                "data": {
                    "prediction_id": prediction.get("id"),
                    "area": prediction.get("area"),
                    "date": prediction.get("date"),
                    "confidence": prediction.get("confidence"),
                    "accuracy": prediction.get("accuracy"),
                },
                "timestamp": datetime.now().isoformat(),
                "read": False,
                "actions": [
                    {
                        "label": translator.translate("view_details"),
                        "action": "view_prediction",
                        "prediction_id": prediction.get("id")
                    }
                ]
            }
            
            # Queue notification for delivery
            await self._queue_notification(notification)
            
            logger.info(f"Queued {notification_type} notification for user {user_id}")
            
            return {
                "success": True,
                "notification_id": notification["id"],
                "delivery_status": "queued"
            }
            
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def send_daily_digest(
        self,
        user_id: int,
        predictions: List[Dict],
        language: Language = Language.ENGLISH
    ) -> Dict:
        """
        Send daily digest of predictions
        """
        translator = get_translator(language)
        
        notification = {
            "id": f"digest_{user_id}_{datetime.now().date()}",
            "user_id": user_id,
            "type": NotificationType.EMAIL,
            "priority": NotificationPriority.LOW,
            "language": language,
            "title": translator.translate("daily_digest"),
            "message": f"{len(predictions)} {translator.translate('new_predictions')}",
            "data": {
                "predictions": predictions,
                "date": datetime.now().date().isoformat()
            },
            "timestamp": datetime.now().isoformat()
        }
        
        await self._queue_notification(notification)
        
        return {
            "success": True,
            "notification_id": notification["id"]
        }
    
    async def send_high_accuracy_alert(
        self,
        user_id: int,
        prediction: Dict,
        language: Language = Language.ENGLISH
    ) -> Dict:
        """
        Send alert for high accuracy predictions (>90%)
        """
        if prediction.get("accuracy", 0) < 0.9:
            return {"success": False, "reason": "accuracy_threshold_not_met"}
        
        translator = get_translator(language)
        
        notification = {
            "id": f"alert_{user_id}_{datetime.now().timestamp()}",
            "user_id": user_id,
            "type": NotificationType.PUSH,
            "priority": NotificationPriority.HIGH,
            "language": language,
            "title": "🎯 " + translator.translate("high_accuracy_prediction"),
            "message": f"{prediction.get('title')} - {int(prediction.get('accuracy', 0) * 100)}% {translator.translate('accuracy')}",
            "data": prediction,
            "timestamp": datetime.now().isoformat(),
            "actions": [
                {
                    "label": translator.translate("view_now"),
                    "action": "view_prediction",
                    "prediction_id": prediction.get("id")
                }
            ]
        }
        
        await self._queue_notification(notification)
        
        return {
            "success": True,
            "notification_id": notification["id"]
        }
    
    async def get_user_notifications(
        self,
        user_id: int,
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Dict]:
        """
        Get notifications for a user
        """
        notifications = [
            n for n in self.notification_queue 
            if n["user_id"] == user_id
        ]
        
        if unread_only:
            notifications = [n for n in notifications if not n.get("read", False)]
        
        # Sort by timestamp (newest first)
        notifications.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return notifications[:limit]
    
    async def mark_as_read(self, notification_id: str) -> bool:
        """Mark notification as read"""
        for notification in self.notification_queue:
            if notification["id"] == notification_id:
                notification["read"] = True
                return True
        return False
    
    async def _queue_notification(self, notification: Dict):
        """Add notification to delivery queue"""
        self.notification_queue.append(notification)
        
        # Keep queue size manageable (last 1000 notifications)
        if len(self.notification_queue) > 1000:
            self.notification_queue = self.notification_queue[-1000:]
        
        # In production, this would push to Redis/RabbitMQ for actual delivery
        logger.info(f"Notification queued: {notification['id']}")
    
    def _get_notification_title(self, prediction: Dict, translator) -> str:
        """Generate notification title"""
        area = translator.translate(prediction.get("area", "prediction"))
        confidence = prediction.get("confidence", "").replace("_", " ").title()
        
        return f"{area.title()} - {confidence}"
    
    def _get_notification_message(self, prediction: Dict, translator) -> str:
        """Generate notification message"""
        title = prediction.get("title", "")
        accuracy = int(prediction.get("accuracy", 0) * 100)
        
        return f"{title} ({accuracy}% {translator.translate('accuracy')})"


# Global instance
notification_service = NotificationService()
