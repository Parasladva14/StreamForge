import { useEffect, useRef } from "react";

import websocket from "../services/websocket";

export default function useNotifications(onNotification) {
  const callbackRef = useRef(onNotification);

  useEffect(() => {
    callbackRef.current = onNotification;
  });

  useEffect(() => {
    websocket.connect((data) => {
      if (!callbackRef.current) return;

      // The WebSocket event wrapper has the shape:
      //   { event: "alert_created"|"geofence_event", notification: {...}, ... }
      // Extract the actual notification object from the wrapper.
      const notification = data?.notification;
      if (notification && notification.id) {
        callbackRef.current(notification);
      }
    });

    return () => {
      websocket.disconnect();
    };
  }, []);
}