from typing import List, Dict, Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.channel_subscribers: Dict[str, Set[WebSocket]] = {
            "all": set(),
            "trucks": set(),
            "notifications": set(),
        }

    async def connect(self, websocket: WebSocket, channel: str = "all"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if channel in self.channel_subscribers:
            self.channel_subscribers[channel].add(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for ch in self.channel_subscribers.values():
            if websocket in ch:
                ch.remove(websocket)

    async def broadcast(self, message: dict, channel: str = "all"):
        """
        Broadcast JSON message to subscribers of given channel and 'all'.
        """
        targets: Set[WebSocket] = set(self.active_connections)
        if channel != "all" and channel in self.channel_subscribers:
            targets = self.channel_subscribers[channel] | self.channel_subscribers.get("all", set())

        disconnected = []
        for connection in list(targets):
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(connection)


manager = ConnectionManager()