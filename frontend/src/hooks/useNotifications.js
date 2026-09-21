import { useEffect, useRef } from "react";

import websocket from "../services/websocket";

export default function useNotifications(
  onNotification
) {
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

  useEffect(() => {

    websocket.connect((data) => {
      if (callbackRef.current) {
        callbackRef.current(data);
      }
    });

    return () => {

      websocket.disconnect();

    };

  }, []);

}