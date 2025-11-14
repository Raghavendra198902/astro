"""
Celery Configuration and Task Definitions
"""

from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "astor_tasks",
    broker=settings.RABBITMQ_URL or "amqp://guest:guest@rabbitmq:5672//",
    backend=settings.REDIS_URL or "redis://redis:6379/0"
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    "check-transits-every-hour": {
        "task": "app.services.tasks.transit_tasks.check_all_transit_watches",
        "schedule": crontab(minute=0),  # Every hour
    },
    "cleanup-expired-biometrics-daily": {
        "task": "app.services.tasks.cleanup_tasks.cleanup_expired_biometric_data",
        "schedule": crontab(hour=2, minute=0),  # 2 AM daily
    },
    "generate-daily-forecasts": {
        "task": "app.services.tasks.forecast_tasks.generate_daily_forecasts",
        "schedule": crontab(hour=0, minute=0),  # Midnight
    },
}

# Import task modules (registers tasks with Celery)
from app.services.tasks import transit_tasks, email_tasks, cleanup_tasks, forecast_tasks

__all__ = ["celery_app"]
