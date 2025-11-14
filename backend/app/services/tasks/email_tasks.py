"""
Email Notification Tasks
"""

from typing import Dict, Any
import logging
from app.services.tasks.celery_config import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.tasks.email_tasks.send_transit_alert")
def send_transit_alert(email: str, message: str):
    """Send transit alert email"""
    logger.info(f"Sending transit alert to {email}")
    
    # In production, integrate with email service (SendGrid, AWS SES, etc.)
    # For now, log the email
    
    subject = "Significant Astrological Transit Alert"
    
    logger.info(f"Email to {email}: {subject}")
    logger.info(f"Message: {message}")
    
    return {"status": "sent", "email": email}


@celery_app.task(name="app.services.tasks.email_tasks.send_report_email")
def send_report_email(email: str, report_url: str, report_type: str):
    """Send report ready notification"""
    logger.info(f"Sending report notification to {email}")
    
    subject = f"Your {report_type} Report is Ready"
    message = f"Your {report_type} report is ready for download: {report_url}"
    
    logger.info(f"Email to {email}: {subject}")
    
    return {"status": "sent", "email": email}
