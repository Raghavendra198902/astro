"""
Enterprise WebSocket Manager for Real-time Updates
Supports live transit updates, notifications, and collaborative features
"""
from typing import Dict, Set, Optional
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
import json
import asyncio
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Enterprise-grade WebSocket connection manager
    Supports rooms, broadcasting, and targeted messaging
    """
    
    def __init__(self):
        # Active connections by user_id
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Room-based connections for collaborative features
        self.rooms: Dict[str, Set[WebSocket]] = {}
        # Connection metadata
        self.connection_metadata: Dict[WebSocket, dict] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str, room: Optional[str] = None):
        """Connect a client and optionally join a room"""
        await websocket.accept()
        
        # Add to user connections
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        
        # Add to room if specified
        if room:
            if room not in self.rooms:
                self.rooms[room] = set()
            self.rooms[room].add(websocket)
        
        # Store metadata
        self.connection_metadata[websocket] = {
            "user_id": user_id,
            "room": room,
            "connected_at": datetime.utcnow(),
            "last_heartbeat": datetime.utcnow()
        }
        
        logger.info(f"WebSocket connected: user={user_id}, room={room}")
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connected",
            "message": "Connected to astrology platform",
            "timestamp": datetime.utcnow().isoformat(),
            "features": ["live_transits", "notifications", "collaborative_charts"]
        }, websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Disconnect a client and clean up"""
        if websocket in self.connection_metadata:
            metadata = self.connection_metadata[websocket]
            user_id = metadata["user_id"]
            room = metadata.get("room")
            
            # Remove from user connections
            if user_id in self.active_connections:
                self.active_connections[user_id].discard(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            
            # Remove from room
            if room and room in self.rooms:
                self.rooms[room].discard(websocket)
                if not self.rooms[room]:
                    del self.rooms[room]
            
            # Remove metadata
            del self.connection_metadata[websocket]
            
            logger.info(f"WebSocket disconnected: user={user_id}, room={room}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            self.disconnect(websocket)
    
    async def send_to_user(self, message: dict, user_id: str):
        """Send message to all connections of a user"""
        if user_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending to user {user_id}: {e}")
                    disconnected.append(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                self.disconnect(conn)
    
    async def broadcast_to_room(self, message: dict, room: str):
        """Broadcast message to all clients in a room"""
        if room in self.rooms:
            disconnected = []
            for connection in self.rooms[room]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to room {room}: {e}")
                    disconnected.append(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                self.disconnect(conn)
    
    async def broadcast_all(self, message: dict):
        """Broadcast message to all connected clients"""
        all_connections = set()
        for connections in self.active_connections.values():
            all_connections.update(connections)
        
        disconnected = []
        for connection in all_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.disconnect(conn)
    
    def get_active_users_count(self) -> int:
        """Get count of active users"""
        return len(self.active_connections)
    
    def get_room_users_count(self, room: str) -> int:
        """Get count of users in a room"""
        return len(self.rooms.get(room, set()))
    
    async def heartbeat_check(self):
        """Periodic heartbeat to check connection health"""
        while True:
            await asyncio.sleep(30)  # Check every 30 seconds
            
            current_time = datetime.utcnow()
            stale_connections = []
            
            for websocket, metadata in self.connection_metadata.items():
                last_heartbeat = metadata["last_heartbeat"]
                if (current_time - last_heartbeat).seconds > 60:
                    stale_connections.append(websocket)
            
            for conn in stale_connections:
                logger.warning("Closing stale connection")
                self.disconnect(conn)


# Global connection manager instance
manager = ConnectionManager()


class TransitUpdateService:
    """
    Service for sending live transit updates to connected clients
    """
    
    def __init__(self, connection_manager: ConnectionManager):
        self.manager = connection_manager
        self.update_interval = 60  # Update every minute
        self.is_running = False
    
    async def start(self):
        """Start the transit update service"""
        self.is_running = True
        logger.info("Transit update service started")
        
        while self.is_running:
            try:
                await self.send_transit_updates()
                await asyncio.sleep(self.update_interval)
            except Exception as e:
                logger.error(f"Error in transit update service: {e}")
                await asyncio.sleep(5)
    
    async def send_transit_updates(self):
        """Calculate and send current transit positions to all connected clients"""
        from app.services.chart.engine import ChartEngine
        from datetime import datetime as dt_module
        
        try:
            # Calculate current transits
            current_utc = dt_module.utcnow()
            
            # Use ChartEngine with proper parameters
            chart_engine = ChartEngine()
            transit_chart = chart_engine.generate_chart(
                dt=current_utc,
                lat=28.6139,  # Default Delhi
                lon=77.2090,
                system="vedic"
            )
            
            # Prepare transit update message
            update_message = {
                "type": "transit_update",
                "timestamp": current_utc.isoformat(),
                "planets": transit_chart.get("planets", {}),
                "ascendant": transit_chart.get("ascendant", {}),
                "houses": transit_chart.get("houses", [])
            }
            
            # Broadcast to all connected clients
            await self.manager.broadcast_all(update_message)
            
            logger.debug(f"Sent transit update to {self.manager.get_active_users_count()} users")
            
        except Exception as e:
            logger.error(f"Error calculating transits: {e}")
    
    def stop(self):
        """Stop the transit update service"""
        self.is_running = False
        logger.info("Transit update service stopped")


# Global transit service instance
transit_service = TransitUpdateService(manager)
