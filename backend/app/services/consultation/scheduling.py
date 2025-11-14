"""
Consultation Scheduling Service
Manages astrologer availability, booking slots, and session scheduling
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from zoneinfo import ZoneInfo
import logging

from app.models.models import (
    User,
    ConsultationSlot,
    ConsultationBooking,
    Subscription
)

logger = logging.getLogger(__name__)


class SchedulingService:
    """Handles consultation scheduling and availability management"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_availability_slots(
        self,
        astrologer_id: int,
        start_datetime: datetime,
        end_datetime: datetime,
        slot_duration_minutes: int = 30,
        timezone: str = "UTC"
    ) -> List[ConsultationSlot]:
        """
        Create availability slots for an astrologer
        
        Args:
            astrologer_id: ID of the astrologer
            start_datetime: Start of availability window
            end_datetime: End of availability window
            slot_duration_minutes: Duration of each slot
            timezone: Timezone for the slots
            
        Returns:
            List of created consultation slots
        """
        # Verify astrologer exists and has appropriate role
        stmt = select(User).where(
            User.id == astrologer_id,
            User.role == "astrologer"
        )
        result = await self.db.execute(stmt)
        astrologer = result.scalars().first()
        
        if not astrologer:
            raise ValueError("Invalid astrologer ID or user is not an astrologer")
        
        # Generate slots
        slots = []
        current_time = start_datetime
        slot_delta = timedelta(minutes=slot_duration_minutes)
        
        while current_time + slot_delta <= end_datetime:
            # Check for existing slot at this time
            existing_stmt = select(ConsultationSlot).where(
                ConsultationSlot.astrologer_id == astrologer_id,
                ConsultationSlot.start_time == current_time,
                ConsultationSlot.is_active == True
            )
            existing_result = await self.db.execute(existing_stmt)
            existing_slot = existing_result.scalars().first()
            
            if not existing_slot:
                slot = ConsultationSlot(
                    astrologer_id=astrologer_id,
                    start_time=current_time,
                    end_time=current_time + slot_delta,
                    is_available=True,
                    timezone=timezone,
                    is_active=True
                )
                slots.append(slot)
                self.db.add(slot)
            
            current_time += slot_delta
        
        if slots:
            await self.db.commit()
            for slot in slots:
                await self.db.refresh(slot)
        
        logger.info(
            f"Created {len(slots)} availability slots for astrologer {astrologer_id}"
        )
        
        return slots
    
    async def get_available_slots(
        self,
        astrologer_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 50
    ) -> List[ConsultationSlot]:
        """
        Get available consultation slots
        
        Args:
            astrologer_id: Filter by specific astrologer (optional)
            start_date: Filter slots after this date (optional)
            end_date: Filter slots before this date (optional)
            limit: Maximum number of slots to return
            
        Returns:
            List of available consultation slots
        """
        conditions = [
            ConsultationSlot.is_available == True,
            ConsultationSlot.is_active == True,
            ConsultationSlot.start_time > datetime.utcnow()
        ]
        
        if astrologer_id:
            conditions.append(ConsultationSlot.astrologer_id == astrologer_id)
        
        if start_date:
            conditions.append(ConsultationSlot.start_time >= start_date)
        
        if end_date:
            conditions.append(ConsultationSlot.end_time <= end_date)
        
        stmt = select(ConsultationSlot).where(
            and_(*conditions)
        ).order_by(
            ConsultationSlot.start_time
        ).limit(limit)
        
        result = await self.db.execute(stmt)
        slots = result.scalars().all()
        
        return list(slots)
    
    async def book_consultation(
        self,
        slot_id: int,
        seeker_id: int,
        consultation_type: str = "general",
        notes: Optional[str] = None,
        payment_verified: bool = False
    ) -> ConsultationBooking:
        """
        Book a consultation slot
        
        Args:
            slot_id: ID of the slot to book
            seeker_id: ID of the seeker booking the consultation
            consultation_type: Type of consultation (general, specific, etc.)
            notes: Additional notes from seeker
            payment_verified: Whether payment has been verified
            
        Returns:
            Created consultation booking
            
        Raises:
            ValueError: If slot is not available or user doesn't have access
        """
        # Get the slot
        stmt = select(ConsultationSlot).where(
            ConsultationSlot.id == slot_id,
            ConsultationSlot.is_active == True
        )
        result = await self.db.execute(stmt)
        slot = result.scalars().first()
        
        if not slot:
            raise ValueError("Slot not found")
        
        if not slot.is_available:
            raise ValueError("Slot is not available")
        
        if slot.start_time <= datetime.utcnow():
            raise ValueError("Cannot book past slots")
        
        # Check for conflicting bookings
        conflict_stmt = select(ConsultationBooking).where(
            ConsultationBooking.seeker_id == seeker_id,
            ConsultationBooking.status.in_(["scheduled", "in_progress"]),
            or_(
                and_(
                    ConsultationBooking.scheduled_start >= slot.start_time,
                    ConsultationBooking.scheduled_start < slot.end_time
                ),
                and_(
                    ConsultationBooking.scheduled_end > slot.start_time,
                    ConsultationBooking.scheduled_end <= slot.end_time
                )
            )
        )
        conflict_result = await self.db.execute(conflict_stmt)
        conflict = conflict_result.scalars().first()
        
        if conflict:
            raise ValueError(
                "You have a conflicting booking at this time"
            )
        
        # Verify payment if required (Pro/Astrologer plans get free consultations)
        if not payment_verified:
            # Check subscription
            sub_stmt = select(Subscription).where(
                Subscription.user_id == seeker_id,
                Subscription.status == "active"
            )
            sub_result = await self.db.execute(sub_stmt)
            subscription = sub_result.scalars().first()
            
            if not subscription or subscription.plan_name == "Free":
                raise ValueError(
                    "Payment verification required. Upgrade to Pro or Astrologer plan for free consultations."
                )
        
        # Create booking
        booking = ConsultationBooking(
            slot_id=slot_id,
            astrologer_id=slot.astrologer_id,
            seeker_id=seeker_id,
            scheduled_start=slot.start_time,
            scheduled_end=slot.end_time,
            consultation_type=consultation_type,
            notes=notes,
            status="scheduled",
            payment_verified=payment_verified
        )
        
        # Mark slot as unavailable
        slot.is_available = False
        
        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)
        
        logger.info(
            f"Booking created: ID={booking.id}, "
            f"Seeker={seeker_id}, Astrologer={slot.astrologer_id}"
        )
        
        return booking
    
    async def cancel_booking(
        self,
        booking_id: int,
        user_id: int,
        cancellation_reason: Optional[str] = None
    ) -> ConsultationBooking:
        """
        Cancel a consultation booking
        
        Args:
            booking_id: ID of the booking to cancel
            user_id: ID of user cancelling (must be seeker or astrologer)
            cancellation_reason: Optional reason for cancellation
            
        Returns:
            Updated booking
            
        Raises:
            ValueError: If booking not found or user not authorized
        """
        stmt = select(ConsultationBooking).where(
            ConsultationBooking.id == booking_id
        )
        result = await self.db.execute(stmt)
        booking = result.scalars().first()
        
        if not booking:
            raise ValueError("Booking not found")
        
        # Verify user is either seeker or astrologer
        if booking.seeker_id != user_id and booking.astrologer_id != user_id:
            raise ValueError("Not authorized to cancel this booking")
        
        if booking.status not in ["scheduled"]:
            raise ValueError(
                f"Cannot cancel booking with status: {booking.status}"
            )
        
        # Check cancellation window (e.g., must cancel 24 hours before)
        hours_until_session = (
            booking.scheduled_start - datetime.utcnow()
        ).total_seconds() / 3600
        
        if hours_until_session < 24:
            logger.warning(
                f"Late cancellation: {hours_until_session:.1f} hours before session"
            )
        
        # Update booking
        booking.status = "cancelled"
        booking.cancellation_reason = cancellation_reason
        booking.cancelled_at = datetime.utcnow()
        
        # Make slot available again
        slot_stmt = select(ConsultationSlot).where(
            ConsultationSlot.id == booking.slot_id
        )
        slot_result = await self.db.execute(slot_stmt)
        slot = slot_result.scalars().first()
        
        if slot and slot.start_time > datetime.utcnow():
            slot.is_available = True
        
        await self.db.commit()
        await self.db.refresh(booking)
        
        logger.info(f"Booking {booking_id} cancelled by user {user_id}")
        
        return booking
    
    async def start_session(
        self,
        booking_id: int,
        astrologer_id: int
    ) -> Dict[str, Any]:
        """
        Start a consultation session
        
        Args:
            booking_id: ID of the booking
            astrologer_id: ID of the astrologer starting the session
            
        Returns:
            Session information including video token
        """
        stmt = select(ConsultationBooking).where(
            ConsultationBooking.id == booking_id,
            ConsultationBooking.astrologer_id == astrologer_id
        )
        result = await self.db.execute(stmt)
        booking = result.scalars().first()
        
        if not booking:
            raise ValueError("Booking not found or not authorized")
        
        if booking.status != "scheduled":
            raise ValueError(
                f"Cannot start session with status: {booking.status}"
            )
        
        # Update booking status
        booking.status = "in_progress"
        booking.actual_start = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(booking)
        
        logger.info(f"Session started for booking {booking_id}")
        
        return {
            "booking_id": booking.id,
            "status": "in_progress",
            "started_at": booking.actual_start.isoformat(),
            "message": "Session started successfully"
        }
    
    async def end_session(
        self,
        booking_id: int,
        astrologer_id: int,
        session_notes: Optional[str] = None
    ) -> ConsultationBooking:
        """
        End a consultation session
        
        Args:
            booking_id: ID of the booking
            astrologer_id: ID of the astrologer ending the session
            session_notes: Notes from the session
            
        Returns:
            Updated booking
        """
        stmt = select(ConsultationBooking).where(
            ConsultationBooking.id == booking_id,
            ConsultationBooking.astrologer_id == astrologer_id
        )
        result = await self.db.execute(stmt)
        booking = result.scalars().first()
        
        if not booking:
            raise ValueError("Booking not found or not authorized")
        
        if booking.status != "in_progress":
            raise ValueError(
                f"Cannot end session with status: {booking.status}"
            )
        
        # Update booking
        booking.status = "completed"
        booking.actual_end = datetime.utcnow()
        booking.session_notes = session_notes
        
        # Calculate duration
        if booking.actual_start:
            duration = (booking.actual_end - booking.actual_start).total_seconds()
            booking.duration_minutes = int(duration / 60)
        
        await self.db.commit()
        await self.db.refresh(booking)
        
        logger.info(
            f"Session ended for booking {booking_id}, "
            f"duration: {booking.duration_minutes} minutes"
        )
        
        return booking
    
    async def get_astrologer_schedule(
        self,
        astrologer_id: int,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """
        Get astrologer's schedule with slots and bookings
        
        Args:
            astrologer_id: ID of the astrologer
            start_date: Start of date range
            end_date: End of date range
            
        Returns:
            Schedule information with slots and bookings
        """
        # Get all slots in range
        slots_stmt = select(ConsultationSlot).where(
            ConsultationSlot.astrologer_id == astrologer_id,
            ConsultationSlot.start_time >= start_date,
            ConsultationSlot.end_time <= end_date,
            ConsultationSlot.is_active == True
        ).order_by(ConsultationSlot.start_time)
        
        slots_result = await self.db.execute(slots_stmt)
        slots = slots_result.scalars().all()
        
        # Get all bookings in range
        bookings_stmt = select(ConsultationBooking).where(
            ConsultationBooking.astrologer_id == astrologer_id,
            ConsultationBooking.scheduled_start >= start_date,
            ConsultationBooking.scheduled_end <= end_date,
            ConsultationBooking.status.in_(["scheduled", "in_progress", "completed"])
        ).order_by(ConsultationBooking.scheduled_start)
        
        bookings_result = await self.db.execute(bookings_stmt)
        bookings = bookings_result.scalars().all()
        
        return {
            "astrologer_id": astrologer_id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_slots": len(slots),
            "available_slots": sum(1 for s in slots if s.is_available),
            "total_bookings": len(bookings),
            "scheduled": sum(1 for b in bookings if b.status == "scheduled"),
            "completed": sum(1 for b in bookings if b.status == "completed"),
            "slots": [
                {
                    "id": s.id,
                    "start_time": s.start_time.isoformat(),
                    "end_time": s.end_time.isoformat(),
                    "is_available": s.is_available,
                    "timezone": s.timezone
                }
                for s in slots
            ],
            "bookings": [
                {
                    "id": b.id,
                    "seeker_id": b.seeker_id,
                    "scheduled_start": b.scheduled_start.isoformat(),
                    "scheduled_end": b.scheduled_end.isoformat(),
                    "status": b.status,
                    "consultation_type": b.consultation_type
                }
                for b in bookings
            ]
        }
