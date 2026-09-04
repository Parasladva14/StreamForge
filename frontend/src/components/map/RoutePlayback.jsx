import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const truckIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1995/1995506.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export default function RoutePlayback({
  route = [],
  currentIndex = 0,
}) {
  if (!route.length) return null;

  const current = route[currentIndex];

  if (!current) return null;

  return (
    <Marker
      position={[
        current.latitude,
        current.longitude,
      ]}
      icon={truckIcon}
    >
      <Popup>
        <div>
          <h4>Truck Position</h4>

          <p>
            <strong>Speed:</strong>{" "}
            {current.speed} km/h
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {new Date(
              current.timestamp
            ).toLocaleString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}