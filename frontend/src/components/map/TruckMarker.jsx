import { Marker } from "react-leaflet";
import L from "leaflet";

import TruckPopup from "./TruckPopup";

function getColor(status) {
  switch (status) {
    case "critical":
      return "red";

    case "warning":
      return "orange";

    default:
      return "green";
  }
}

export default function TruckMarker({ truck }) {
  const icon = L.divIcon({
    className: "custom-marker",

    html: `
      <div
        style="
          background:${getColor(truck.status)};
          width:18px;
          height:18px;
          border-radius:50%;
          border:3px solid white;
        ">
      </div>
    `,
  });

  return (
    <Marker
      position={[
        truck.latitude,
        truck.longitude,
      ]}
      icon={icon}
    >
      <TruckPopup truck={truck} />
    </Marker>
  );
}