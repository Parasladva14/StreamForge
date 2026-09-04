import { Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const endIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function RouteHistory({ points = [] }) {
  if (!points.length) return null;

  const positions = points.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#007bff",
          weight: 5,
        }}
      />

      {/* Start Marker */}
      <Marker position={positions[0]} icon={startIcon}>
        <Popup>
          <strong>Start Point</strong>
        </Popup>
      </Marker>

      {/* End Marker */}
      <Marker
        position={positions[positions.length - 1]}
        icon={endIcon}
      >
        <Popup>
          <strong>End Point</strong>
        </Popup>
      </Marker>
    </>
  );
}