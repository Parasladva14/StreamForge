import { useEffect, useRef } from "react";
import truckWebSocket from "../services/truckWebSocket";

export default function useTruckTracking(onLocationUpdate) {
  const callbackRef = useRef(onLocationUpdate);

  useEffect(() => {
    callbackRef.current = onLocationUpdate;
  });

  useEffect(() => {
    truckWebSocket.connect((data) => {
      if (!callbackRef.current) return;

      // The WebSocket event wrapper has the shape:
      //   { event: "truck_updated", truck: {...} }
      // Extract the actual truck payload from the wrapper.
      const truck = data?.truck || data;
      if (truck && (truck.truck_id || truck.id)) {
        callbackRef.current(truck);
      }
    });

    return () => {
      truckWebSocket.disconnect();
    };
  }, []);
}