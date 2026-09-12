from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, channel="all")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "event": "pong",
                "message": data,
            })
    except (WebSocketDisconnect, Exception):
        manager.disconnect(websocket)


@router.websocket("/ws/notifications")
async def notifications_websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, channel="notifications")
    try:
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        manager.disconnect(websocket)


@router.websocket("/ws/trucks")
async def trucks_websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, channel="trucks")
    try:
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        manager.disconnect(websocket)