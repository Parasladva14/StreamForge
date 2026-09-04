import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapController({
  selectedTruck,
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTruck) return;

    map.flyTo(
      [
        selectedTruck.latitude,
        selectedTruck.longitude,
      ],
      15,
      {
        animate: true,
        duration: 2,
      }
    );
  }, [selectedTruck, map]);

  return null;
}