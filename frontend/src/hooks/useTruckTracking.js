import { useEffect, useRef } from "react";
import truckWebSocket from "../services/truckWebSocket";

export default function useTruckTracking(onLocationUpdate) {
  const callbackRef = useRef(onLocationUpdate);
  callbackRef.current = onLocationUpdate;

  useEffect(() => {
    truckWebSocket.connect((data) => {
      if (callbackRef.current) {
        callbackRef.current(data);
      }
    });

    return () => {
      truckWebSocket.disconnect();
    };
  }, []);
}