"""
WebRTC Video Integration
Handles video call token generation and room management
Supports Daily.co and Agora platforms
"""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import httpx
import hashlib
import hmac
import time
import logging

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class VideoCallService:
    """Manages WebRTC video call integration"""
    
    def __init__(self, provider: str = "daily"):
        """
        Initialize video call service
        
        Args:
            provider: Video platform ('daily' or 'agora')
        """
        self.provider = provider.lower()
        
        if self.provider == "daily":
            self.api_key = getattr(settings, "DAILY_API_KEY", None)
            self.base_url = "https://api.daily.co/v1"
        elif self.provider == "agora":
            self.app_id = getattr(settings, "AGORA_APP_ID", None)
            self.app_certificate = getattr(settings, "AGORA_APP_CERTIFICATE", None)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    async def create_room(
        self,
        booking_id: int,
        max_participants: int = 2,
        enable_recording: bool = False,
        expires_minutes: int = 90
    ) -> Dict[str, Any]:
        """
        Create a video call room
        
        Args:
            booking_id: Consultation booking ID
            max_participants: Maximum number of participants
            enable_recording: Whether to enable cloud recording
            expires_minutes: Room expiration time in minutes
            
        Returns:
            Room information including URL and ID
        """
        if self.provider == "daily":
            return await self._create_daily_room(
                booking_id,
                max_participants,
                enable_recording,
                expires_minutes
            )
        elif self.provider == "agora":
            return await self._create_agora_channel(
                booking_id,
                expires_minutes
            )
        
        raise NotImplementedError(f"Provider {self.provider} not implemented")
    
    async def _create_daily_room(
        self,
        booking_id: int,
        max_participants: int,
        enable_recording: bool,
        expires_minutes: int
    ) -> Dict[str, Any]:
        """Create a Daily.co room"""
        if not self.api_key:
            logger.warning("Daily.co API key not configured, using mock room")
            return {
                "room_name": f"consultation-{booking_id}",
                "room_url": f"https://astorai.daily.co/consultation-{booking_id}",
                "expires": (datetime.utcnow() + timedelta(minutes=expires_minutes)).isoformat(),
                "provider": "daily",
                "mock": True
            }
        
        room_name = f"consultation-{booking_id}-{int(time.time())}"
        expires_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        payload = {
            "name": room_name,
            "properties": {
                "max_participants": max_participants,
                "enable_recording": "cloud" if enable_recording else "off",
                "exp": int(expires_at.timestamp()),
                "enable_chat": True,
                "enable_screenshare": True,
                "enable_knocking": False,
                "start_video_off": False,
                "start_audio_off": False
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/rooms",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload,
                    timeout=10.0
                )
                response.raise_for_status()
                
                data = response.json()
                
                logger.info(f"Daily.co room created: {room_name}")
                
                return {
                    "room_name": data["name"],
                    "room_url": data["url"],
                    "expires": expires_at.isoformat(),
                    "provider": "daily",
                    "config": data.get("config", {})
                }
                
        except Exception as e:
            logger.error(f"Failed to create Daily.co room: {e}")
            raise ValueError(f"Failed to create video room: {str(e)}")
    
    async def _create_agora_channel(
        self,
        booking_id: int,
        expires_minutes: int
    ) -> Dict[str, Any]:
        """Create an Agora channel"""
        if not self.app_id:
            logger.warning("Agora App ID not configured, using mock channel")
            return {
                "channel_name": f"consultation-{booking_id}",
                "app_id": "mock_app_id",
                "expires": (datetime.utcnow() + timedelta(minutes=expires_minutes)).isoformat(),
                "provider": "agora",
                "mock": True
            }
        
        channel_name = f"consultation-{booking_id}"
        
        return {
            "channel_name": channel_name,
            "app_id": self.app_id,
            "expires": (datetime.utcnow() + timedelta(minutes=expires_minutes)).isoformat(),
            "provider": "agora"
        }
    
    async def generate_token(
        self,
        room_name: str,
        user_id: int,
        is_moderator: bool = False,
        expires_minutes: int = 90
    ) -> Dict[str, Any]:
        """
        Generate access token for video call
        
        Args:
            room_name: Name of the room/channel
            user_id: User ID for token
            is_moderator: Whether user has moderator privileges
            expires_minutes: Token expiration time
            
        Returns:
            Token information
        """
        if self.provider == "daily":
            return await self._generate_daily_token(
                room_name,
                user_id,
                is_moderator,
                expires_minutes
            )
        elif self.provider == "agora":
            return await self._generate_agora_token(
                room_name,
                user_id,
                is_moderator,
                expires_minutes
            )
        
        raise NotImplementedError(f"Provider {self.provider} not implemented")
    
    async def _generate_daily_token(
        self,
        room_name: str,
        user_id: int,
        is_moderator: bool,
        expires_minutes: int
    ) -> Dict[str, Any]:
        """Generate Daily.co meeting token"""
        if not self.api_key:
            logger.warning("Daily.co API key not configured, using mock token")
            return {
                "token": f"mock_token_{user_id}_{room_name}",
                "expires": (datetime.utcnow() + timedelta(minutes=expires_minutes)).isoformat(),
                "provider": "daily",
                "mock": True
            }
        
        expires_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        payload = {
            "properties": {
                "room_name": room_name,
                "user_id": str(user_id),
                "is_owner": is_moderator,
                "exp": int(expires_at.timestamp())
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/meeting-tokens",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload,
                    timeout=10.0
                )
                response.raise_for_status()
                
                data = response.json()
                
                logger.info(f"Daily.co token generated for user {user_id}")
                
                return {
                    "token": data["token"],
                    "expires": expires_at.isoformat(),
                    "provider": "daily"
                }
                
        except Exception as e:
            logger.error(f"Failed to generate Daily.co token: {e}")
            raise ValueError(f"Failed to generate video token: {str(e)}")
    
    async def _generate_agora_token(
        self,
        channel_name: str,
        user_id: int,
        is_moderator: bool,
        expires_minutes: int
    ) -> Dict[str, Any]:
        """Generate Agora RTC token"""
        if not self.app_id or not self.app_certificate:
            logger.warning("Agora credentials not configured, using mock token")
            return {
                "token": f"mock_agora_token_{user_id}_{channel_name}",
                "uid": user_id,
                "channel_name": channel_name,
                "expires": (datetime.utcnow() + timedelta(minutes=expires_minutes)).isoformat(),
                "provider": "agora",
                "mock": True
            }
        
        # Agora token generation (simplified - use agora-token-builder in production)
        expires_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
        privilege_expired_ts = int(expires_at.timestamp())
        
        # Role: 1 = publisher (astrologer), 2 = subscriber (seeker)
        role = 1 if is_moderator else 2
        
        # Mock token for now - implement proper Agora token builder
        token = f"agora_token_{channel_name}_{user_id}_{privilege_expired_ts}"
        
        logger.info(f"Agora token generated for user {user_id} (mock)")
        
        return {
            "token": token,
            "uid": user_id,
            "channel_name": channel_name,
            "app_id": self.app_id,
            "role": role,
            "expires": expires_at.isoformat(),
            "provider": "agora",
            "mock": True
        }
    
    async def delete_room(self, room_name: str) -> bool:
        """
        Delete a video room
        
        Args:
            room_name: Name of the room to delete
            
        Returns:
            True if successful
        """
        if self.provider == "daily":
            return await self._delete_daily_room(room_name)
        elif self.provider == "agora":
            # Agora channels don't need explicit deletion
            return True
        
        return False
    
    async def _delete_daily_room(self, room_name: str) -> bool:
        """Delete Daily.co room"""
        if not self.api_key:
            logger.warning("Daily.co API key not configured, skipping room deletion")
            return True
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/rooms/{room_name}",
                    headers={
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                
                logger.info(f"Daily.co room deleted: {room_name}")
                return True
                
        except Exception as e:
            logger.error(f"Failed to delete Daily.co room: {e}")
            return False
