"""
Transit Detection Tasks
Check for significant transits and send notifications
"""

from typing import List, Dict, Any
import logging
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.tasks.celery_config import celery_app
from app.core.database import async_session_maker
from app.models.models import TransitWatch, User, Chart
from app.services.chart.engine import chart_engine
from app.services.tasks.email_tasks import send_transit_alert

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.tasks.transit_tasks.check_all_transit_watches")
def check_all_transit_watches():
    """Check all active transit watches (runs hourly)"""
    import asyncio
    
    async def _check():
        async with async_session_maker() as session:
            # Get all active transit watches
            stmt = select(TransitWatch).where(
                TransitWatch.is_active == True
            )
            result = await session.execute(stmt)
            watches = result.scalars().all()
            
            logger.info(f"Checking {len(watches)} active transit watches")
            
            for watch in watches:
                try:
                    await check_transit_watch(session, watch)
                except Exception as e:
                    logger.error(f"Error checking watch {watch.id}: {e}")
    
    asyncio.run(_check())


async def check_transit_watch(session: AsyncSession, watch: TransitWatch):
    """Check a specific transit watch"""
    # Get user's natal chart
    stmt = select(Chart).where(
        Chart.user_id == watch.user_id,
        Chart.chart_type == "natal"
    ).order_by(Chart.created_at.desc())
    
    result = await session.execute(stmt)
    natal_chart = result.scalars().first()
    
    if not natal_chart:
        logger.warning(f"No natal chart for user {watch.user_id}")
        return
    
    # Calculate current transits
    now = datetime.utcnow()
    current_transits = chart_engine.generate_chart(
        dt=now,
        lat=natal_chart.json_payload["latitude"],
        lon=natal_chart.json_payload["longitude"],
        system="vedic" if natal_chart.json_payload["system"] == "vedic" else "western",
        house_system=natal_chart.json_payload.get("house_system", "placidus")
    )
    
    # Detect significant aspects
    significant_aspects = detect_significant_transits(
        natal_chart.json_payload,
        current_transits,
        watch.aspect_orb
    )
    
    if significant_aspects:
        # Send notification
        await send_transit_notification(
            session,
            watch.user_id,
            significant_aspects
        )
        
        # Update last notified
        watch.last_notified = now
        await session.commit()


def detect_significant_transits(
    natal_chart: Dict[str, Any],
    transit_chart: Dict[str, Any],
    orb: float = 2.0
) -> List[Dict[str, Any]]:
    """
    Detect significant transit aspects to natal planets
    
    Args:
        natal_chart: Natal chart data
        transit_chart: Current transit chart data
        orb: Aspect orb in degrees
        
    Returns:
        List of significant aspects
    """
    significant = []
    
    natal_planets = natal_chart.get("planets", {})
    transit_planets = transit_chart.get("planets", {})
    
    # Key transiting planets (outer planets have more significance)
    key_transits = ["saturn", "jupiter", "rahu", "ketu", "uranus", "neptune", "pluto"]
    
    # Key natal points
    key_natal = ["sun", "moon", "ascendant", "mc"]
    
    for transit_name in key_transits:
        if not transit_planets.get(transit_name):
            continue
        
        transit_long = transit_planets[transit_name]["longitude"]
        
        for natal_name in key_natal:
            if natal_name == "ascendant":
                natal_long = natal_chart.get("ascendant", 0)
            elif natal_name == "mc":
                natal_long = natal_chart.get("mc", 0)
            else:
                if not natal_planets.get(natal_name):
                    continue
                natal_long = natal_planets[natal_name]["longitude"]
            
            # Calculate aspect
            diff = abs(transit_long - natal_long)
            if diff > 180:
                diff = 360 - diff
            
            # Check major aspects
            aspects = [
                (0, "conjunction"),
                (60, "sextile"),
                (90, "square"),
                (120, "trine"),
                (180, "opposition")
            ]
            
            for angle, aspect_name in aspects:
                if abs(diff - angle) <= orb:
                    significant.append({
                        "transit_planet": transit_name,
                        "natal_point": natal_name,
                        "aspect": aspect_name,
                        "orb": round(abs(diff - angle), 2),
                        "exact_date": calculate_exact_aspect_date(
                            transit_long, natal_long, angle
                        )
                    })
    
    return significant


def calculate_exact_aspect_date(
    transit_long: float,
    natal_long: float,
    aspect_angle: float
) -> str:
    """Calculate when aspect becomes exact (simplified)"""
    # In production, would use ephemeris to calculate exact time
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")


async def send_transit_notification(
    session: AsyncSession,
    user_id: int,
    aspects: List[Dict[str, Any]]
):
    """Send transit notification to user"""
    # Get user
    stmt = select(User).where(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        return
    
    # Format aspects message
    message = format_transit_message(aspects)
    
    # Send email (async Celery task)
    send_transit_alert.delay(user.email, message)
    
    logger.info(f"Sent transit alert to user {user_id}")


def format_transit_message(aspects: List[Dict[str, Any]]) -> str:
    """Format transit aspects into readable message"""
    lines = ["You have significant transits occurring:\n"]
    
    for aspect in aspects:
        line = (
            f"• {aspect['transit_planet'].title()} {aspect['aspect']} "
            f"your natal {aspect['natal_point'].title()} "
            f"(exact on {aspect['exact_date']})"
        )
        lines.append(line)
    
    lines.append("\nLog in to your Astor AI dashboard for detailed interpretation.")
    
    return "\n".join(lines)
