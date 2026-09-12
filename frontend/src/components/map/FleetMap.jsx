import {
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useTruckTracking from "../../hooks/useTruckTracking";

import TruckMarker from "./TruckMarker";
import MapController from "./MapController";

import "./FleetMap.css";
import RouteHistory from "./RouteHistory";
import RoutePlayback from "./RoutePlayback";

export default function FleetMap({
  trucks,
  selectedTruck,
  setSelectedTruck,
  route,
  currentIndex,
  onTruckUpdate,
}) {
  // ==========================
  // Live Truck Tracking
  // ==========================
  useTruckTracking((updatedTruck) => {
    if (onTruckUpdate) {
      onTruckUpdate(updatedTruck);
    }
  });

  return (
    <div className="fleet-map">

      <MapContainer
        center={[19.0760, 72.8777]}
        zoom={10}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedTruck={selectedTruck} />

        {trucks.map((truck) => (
          <TruckMarker
            key={truck.id}
            truck={truck}
            onSelect={setSelectedTruck}
          />
        ))}
        <RouteHistory
          points={route}
        />

        <RoutePlayback
          route={route}
          currentIndex={currentIndex}
        />
      </MapContainer>

    </div>
  );
}