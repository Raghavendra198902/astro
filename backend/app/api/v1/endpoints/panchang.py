"""Panchang API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime, date
from typing import Optional
import logging

from app.models.models import User
from app.core.security import get_current_active_user
from app.services.panchang.engine import PanchangEngine

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize Panchang engine
panchang_engine = PanchangEngine()


@router.get("/")
async def get_panchang(
    date_str: Optional[str] = Query(None, description="Date in YYYY-MM-DD format (default: today)"),
    latitude: float = Query(19.0760, description="Latitude (default: Mumbai)"),
    longitude: float = Query(72.8777, description="Longitude (default: Mumbai)"),
    timezone: str = Query("Asia/Kolkata", description="Timezone"),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get complete Panchang (Hindu Vedic Calendar) for a given date and location
    
    Returns:
    - Tithi (Lunar Day)
    - Nakshatra (Lunar Mansion)
    - Yoga
    - Karana
    - Paksha (Lunar Fortnight)
    - Sun & Moon times
    - Auspicious and Inauspicious timings
    """
    try:
        # Parse date or use today
        if date_str:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
        else:
            target_date = datetime.now()
        
        # Calculate panchang
        panchang_data = panchang_engine.get_complete_panchang(
            date=target_date,
            latitude=latitude,
            longitude=longitude,
            timezone_str=timezone
        )
        
        return {
            "success": True,
            "data": panchang_data
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        logger.error(f"Error calculating panchang: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error calculating panchang: {str(e)}")


@router.get("/festivals")
async def get_festivals(
    year: Optional[int] = Query(None, description="Year (default: current year)"),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of Hindu festivals for the year"""
    if year is None:
        year = datetime.now().year
    
    # Hardcoded festivals for now - can be enhanced with dynamic calculation
    festivals = [
        {"name": "Gita Jayanti", "date": f"{year}-12-11", "description": "Day Krishna taught Bhagavad Gita"},
        {"name": "Pausha Putrada Ekadashi", "date": f"{year}-12-26", "description": "Fasting for children's welfare"},
        {"name": "Makar Sankranti", "date": f"{year + 1}-01-14", "description": "Sun enters Capricorn"},
        {"name": "Maha Shivaratri", "date": f"{year + 1}-02-26", "description": "Great Night of Shiva"},
        {"name": "Holi", "date": f"{year + 1}-03-14", "description": "Festival of Colors"},
        {"name": "Ram Navami", "date": f"{year + 1}-04-06", "description": "Birth of Lord Rama"},
        {"name": "Hanuman Jayanti", "date": f"{year + 1}-04-13", "description": "Birth of Lord Hanuman"},
        {"name": "Akshaya Tritiya", "date": f"{year + 1}-05-01", "description": "Auspicious day for new ventures"},
    ]
    
    return {
        "success": True,
        "data": {
            "year": year,
            "festivals": festivals
        }
    }
