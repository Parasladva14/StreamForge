import { useEffect } from "react";
import truckWebSocket from "../services/truckWebSocket";

export default function useTruckTracking(onLocationUpdate) {
  useEffect(() => {
    truckWebSocket.connect(onLocationUpdate);

    return () => {
      truckWebSocket.disconnect();
    };
  }, [onLocationUpdate]);
}