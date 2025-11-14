"""
Forecast Generation Tasks
"""

import logging
from datetime import datetime

from app.services.tasks.celery_config import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.tasks.forecast_tasks.generate_daily_forecasts")
def generate_daily_forecasts():
    """Generate daily horoscope forecasts for all signs"""
    logger.info("Generating daily forecasts")
    
    signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    
    forecasts = {}
    for sign in signs:
        forecasts[sign] = f"Daily forecast for {sign} on {datetime.utcnow().date()}"
    
    logger.info(f"Generated forecasts for {len(forecasts)} signs")
    return forecasts
