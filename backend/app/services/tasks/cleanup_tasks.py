"""
Cleanup Tasks
"""

import logging
from datetime import datetime, timedelta
from sqlalchemy import select, delete

from app.services.tasks.celery_config import celery_app
from app.core.database import async_session_maker
from app.models.models import BiometricFace, BiometricPalm

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.tasks.cleanup_tasks.cleanup_expired_biometric_data")
def cleanup_expired_biometric_data():
    """Delete expired biometric data (GDPR compliance)"""
    import asyncio
    
    async def _cleanup():
        async with async_session_maker() as session:
            now = datetime.utcnow()
            
            # Delete expired face data
            stmt_face = delete(BiometricFace).where(
                BiometricFace.expires_at < now
            )
            result_face = await session.execute(stmt_face)
            
            # Delete expired palm data
            stmt_palm = delete(BiometricPalm).where(
                BiometricPalm.expires_at < now
            )
            result_palm = await session.execute(stmt_palm)
            
            await session.commit()
            
            deleted_faces = result_face.rowcount
            deleted_palms = result_palm.rowcount
            
            logger.info(
                f"Cleaned up {deleted_faces} face records and "
                f"{deleted_palms} palm records"
            )
            
            return {
                "deleted_faces": deleted_faces,
                "deleted_palms": deleted_palms
            }
    
    return asyncio.run(_cleanup())
