import { useEffect } from "react";

import websocket from "../services/websocket";

export default function useNotifications(
  onNotification
) {

  useEffect(() => {

    websocket.connect(onNotification);

    return () => {

      websocket.disconnect();

    };

  }, [onNotification]);

}