import { useEffect, useRef } from "react";

const WS_URL = "ws://127.0.0.1:8000/ws";

export default function useWebSocket(onMessage) {
  const socketRef = useRef(null);
  const callbackRef = useRef(onMessage);
  const reconnectTimerRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  callbackRef.current = onMessage;

  useEffect(() => {
    const connect = () => {
      if (!shouldReconnectRef.current) return;

      console.log("🔌 Connecting WebSocket...");

      const socket = new WebSocket(WS_URL);

      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket Connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (callbackRef.current) {
            callbackRef.current(data);
          }
        } catch (err) {
          console.error("❌ Invalid WebSocket message:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket Error:", err);
      };

      socket.onclose = (event) => {
        console.log(
          `🔴 WebSocket Closed (code: ${event.code}, reason: ${event.reason || "No reason"})`
        );

        if (
          shouldReconnectRef.current &&
          event.code !== 1000 // Normal closure
        ) {
          reconnectTimerRef.current = setTimeout(() => {
            console.log("🔄 Reconnecting...");
            connect();
          }, 3000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close(1000, "Component unmounted");
      }
    };
  }, []);
}