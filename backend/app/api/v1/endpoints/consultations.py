"""
Consultation API Endpoints
Booking, scheduling, and video session management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, ConsultationBooking, ConsultationSlot
from app.schemas.schemas import (
    SlotCreateRequest,
    SlotResponse,
    BookingCreateRequest,
    BookingResponse,
    VideoTokenResponse
)
from app.services.consultation.scheduling import SchedulingService
from app.services.consultation.video import VideoCallService

router = APIRouter()


@router.post("/slots", response_model=list[SlotResponse], status_code=status.HTTP_201_CREATED)
async def create_availability_slots(
    request: SlotCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create availability slots (astrologer only)"""
    if current_user.role != "astrologer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only astrologers can create availability slots"
        )
    
    scheduler = SchedulingService(db)
    
    try:
        slots = await scheduler.create_availability_slots(
            astrologer_id=current_user.id,
            start_datetime=request.start_datetime,
            end_datetime=request.end_datetime,
            slot_duration_minutes=request.slot_duration_minutes,
            timezone=request.timezone
        )
        
        return slots
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create slots: {str(e)}"
        )


@router.get("/slots", response_model=list[SlotResponse])
async def get_available_slots(
    astrologer_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get available consultation slots"""
    scheduler = SchedulingService(db)
    
    # Default to next 7 days if no date range specified
    if not start_date:
        start_date = datetime.utcnow()
    if not end_date:
        end_date = start_date + timedelta(days=7)
    
    slots = await scheduler.get_available_slots(
        astrologer_id=astrologer_id,
        start_date=start_date,
        end_date=end_date,
        limit=limit
    )
    
    return slots


@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    request: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Book a consultation slot"""
    scheduler = SchedulingService(db)
    
    try:
        booking = await scheduler.book_consultation(
            slot_id=request.slot_id,
            seeker_id=current_user.id,
            consultation_type=request.consultation_type,
            notes=request.notes,
            payment_verified=True  # Assume payment is handled separately
        )
        
        return booking
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )


@router.get("/bookings", response_model=list[BookingResponse])
async def list_bookings(
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's consultation bookings"""
    conditions = []
    
    # Filter by user (seeker or astrologer)
    if current_user.role == "astrologer":
        from sqlalchemy import or_
        conditions.append(
            or_(
                ConsultationBooking.astrologer_id == current_user.id,
                ConsultationBooking.seeker_id == current_user.id
            )
        )
    else:
        conditions.append(ConsultationBooking.seeker_id == current_user.id)
    
    if status_filter:
        conditions.append(ConsultationBooking.status == status_filter)
    
    from sqlalchemy import and_
    stmt = select(ConsultationBooking).where(
        and_(*conditions)
    ).order_by(
        ConsultationBooking.scheduled_start.desc()
    ).offset(skip).limit(limit)
    
    result = await db.execute(stmt)
    bookings = result.scalars().all()
    
    return bookings


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get booking details"""
    stmt = select(ConsultationBooking).where(
        ConsultationBooking.id == booking_id
    )
    result = await db.execute(stmt)
    booking = result.scalars().first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify access
    if booking.seeker_id != current_user.id and booking.astrologer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return booking


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    cancellation_reason: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel a consultation booking"""
    scheduler = SchedulingService(db)
    
    try:
        await scheduler.cancel_booking(
            booking_id=booking_id,
            user_id=current_user.id,
            cancellation_reason=cancellation_reason
        )
        
        return None
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/bookings/{booking_id}/start")
async def start_session(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start consultation session (astrologer only)"""
    if current_user.role != "astrologer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only astrologers can start sessions"
        )
    
    scheduler = SchedulingService(db)
    
    try:
        session_info = await scheduler.start_session(
            booking_id=booking_id,
            astrologer_id=current_user.id
        )
        
        return session_info
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/bookings/{booking_id}/end")
async def end_session(
    booking_id: int,
    session_notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """End consultation session (astrologer only)"""
    if current_user.role != "astrologer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only astrologers can end sessions"
        )
    
    scheduler = SchedulingService(db)
    
    try:
        booking = await scheduler.end_session(
            booking_id=booking_id,
            astrologer_id=current_user.id,
            session_notes=session_notes
        )
        
        return booking
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/bookings/{booking_id}/video-token", response_model=VideoTokenResponse)
async def get_video_token(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get video call token for consultation"""
    # Get booking
    stmt = select(ConsultationBooking).where(
        ConsultationBooking.id == booking_id
    )
    result = await db.execute(stmt)
    booking = result.scalars().first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify access
    if booking.seeker_id != current_user.id and booking.astrologer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check booking status
    if booking.status not in ["scheduled", "in_progress"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot join session with status: {booking.status}"
        )
    
    # Check if session is starting soon (within 15 minutes)
    minutes_until_session = (
        booking.scheduled_start - datetime.utcnow()
    ).total_seconds() / 60
    
    if minutes_until_session > 15 and booking.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Session starts in {int(minutes_until_session)} minutes. Please join closer to the start time."
        )
    
    # Create/get video room
    video_service = VideoCallService(provider="daily")
    
    try:
        # Create room if not exists
        if not booking.video_room_url:
            room_info = await video_service.create_room(
                booking_id=booking.id,
                enable_recording=True
            )
            
            booking.video_room_url = room_info.get("room_url")
            booking.video_room_name = room_info.get("room_name")
            await db.commit()
        
        # Generate token
        is_moderator = (current_user.id == booking.astrologer_id)
        
        token_info = await video_service.generate_token(
            room_name=booking.video_room_name,
            user_id=current_user.id,
            is_moderator=is_moderator,
            expires_minutes=120
        )
        
        return {
            "token": token_info["token"],
            "room_url": booking.video_room_url,
            "room_name": booking.video_room_name,
            "expires": token_info["expires"],
            "is_moderator": is_moderator,
            "provider": token_info["provider"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate video token: {str(e)}"
        )


@router.get("/schedule")
async def get_schedule(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get astrologer's schedule (astrologer only)"""
    if current_user.role != "astrologer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only astrologers can view schedule"
        )
    
    # Default to current week
    if not start_date:
        start_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    if not end_date:
        end_date = start_date + timedelta(days=7)
    
    scheduler = SchedulingService(db)
    schedule = await scheduler.get_astrologer_schedule(
        astrologer_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )
    
    return schedule
