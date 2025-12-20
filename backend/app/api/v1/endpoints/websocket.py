"""
WebSocket endpoints for real-time features
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.core.websocket import manager, transit_service
from app.core.security import get_current_user_ws
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    room: str = Query(None)
):
    """
    Main WebSocket endpoint for real-time updates
    
    Query Parameters:
    - token: JWT authentication token
    - room: Optional room ID for collaborative features
    
    Message Types:
    - transit_update: Live planetary position updates
    - notification: System notifications
    - chart_update: Collaborative chart updates
    - heartbeat: Connection keepalive
    """
    
    # Verify authentication
    try:
        user = await get_current_user_ws(token)
        user_id = str(user.id)
    except Exception as e:
        logger.error(f"WebSocket authentication failed: {e}")
        await websocket.close(code=1008)  # Policy violation
        return
    
    # Connect client
    await manager.connect(websocket, user_id, room)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            
            if message_type == "heartbeat":
                # Update last heartbeat time
                if websocket in manager.connection_metadata:
                    from datetime import datetime
                    manager.connection_metadata[websocket]["last_heartbeat"] = datetime.utcnow()
                
                # Send heartbeat response
                await manager.send_personal_message({
                    "type": "heartbeat_ack",
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
            
            elif message_type == "request_transits":
                # Client requesting current transits
                from app.services.chart.engine import ChartEngine
                from datetime import datetime as dt_module
                
                lat = message.get("latitude", 28.6139)
                lon = message.get("longitude", 77.2090)
                system = message.get("system", "vedic")  # Allow client to specify system
                
                chart_engine = ChartEngine()
                transit_chart = chart_engine.generate_chart(
                    dt=dt_module.utcnow(),
                    lat=lat,
                    lon=lon,
                    system=system
                )
                
                await manager.send_personal_message({
                    "type": "transit_response",
                    "planets": transit_chart.get("planets", {}),
                    "ascendant": transit_chart.get("ascendant", {}),
                    "houses": transit_chart.get("houses", []),
                    "timestamp": dt_module.utcnow().isoformat()
                }, websocket)
            
            elif message_type == "join_room":
                # Join a collaborative room
                room_id = message.get("room_id")
                if room_id:
                    if room_id not in manager.rooms:
                        manager.rooms[room_id] = set()
                    manager.rooms[room_id].add(websocket)
                    manager.connection_metadata[websocket]["room"] = room_id
                    
                    await manager.broadcast_to_room({
                        "type": "user_joined",
                        "user_id": user_id,
                        "room": room_id
                    }, room_id)
            
            elif message_type == "leave_room":
                # Leave a collaborative room
                room_id = message.get("room_id")
                if room_id and room_id in manager.rooms:
                    manager.rooms[room_id].discard(websocket)
                    
                    await manager.broadcast_to_room({
                        "type": "user_left",
                        "user_id": user_id,
                        "room": room_id
                    }, room_id)
            
            elif message_type == "chart_annotation":
                # Collaborative chart annotation
                if room:
                    await manager.broadcast_to_room({
                        "type": "chart_annotation",
                        "user_id": user_id,
                        "annotation": message.get("annotation"),
                        "position": message.get("position")
                    }, room)
            
            else:
                # Echo unknown message types for debugging
                await manager.send_personal_message({
                    "type": "unknown_message_type",
                    "original": message
                }, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        
        if room:
            await manager.broadcast_to_room({
                "type": "user_disconnected",
                "user_id": user_id
            }, room)
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


@router.get("/ws/stats")
async def get_websocket_stats():
    """Get WebSocket connection statistics"""
    return {
        "active_users": manager.get_active_users_count(),
        "total_connections": sum(len(conns) for conns in manager.active_connections.values()),
        "active_rooms": len(manager.rooms),
        "rooms": {
            room: len(connections) for room, connections in manager.rooms.items()
        }
    }
