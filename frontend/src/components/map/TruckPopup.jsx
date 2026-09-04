import { Popup } from "react-leaflet";

export default function TruckPopup({ truck }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "#ef4444";

      case "warning":
        return "#f59e0b";

      case "normal":
        return "#10b981";

      default:
        return "#6b7280";
    }
  };

  return (
    <Popup minWidth={260}>
      <div
        style={{
          minWidth: "250px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h3
          style={{
            margin: "0 0 10px",
            color: "#1f2937",
          }}
        >
          🚚 {truck.truck_no}
        </h3>

        <hr />

        <p>
          <strong>👤 Driver:</strong> {truck.driver}
        </p>

        <p>
          <strong>📍 Status:</strong>{" "}
          <span
            style={{
              background: getStatusColor(truck.status),
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "10px",
              fontSize: "12px",
              textTransform: "capitalize",
            }}
          >
            {truck.status}
          </span>
        </p>

        <p>
          <strong>🚗 Speed:</strong> {truck.speed} km/h
        </p>

        <p>
          <strong>🌡 Temperature:</strong>{" "}
          {truck.temperature ?? "--"} °C
        </p>

        <p>
          <strong>⛽ Fuel:</strong>{" "}
          {truck.fuel ?? "--"}%
        </p>

        <p>
          <strong>🔋 Battery:</strong>{" "}
          {truck.battery ?? "100"}%
        </p>

        <p>
          <strong>⚙ Engine:</strong>{" "}
          {truck.engine_status ?? "Running"}
        </p>

        <hr />

        <p>
          <strong>📌 Latitude:</strong>{" "}
          {Number(truck.latitude).toFixed(5)}
        </p>

        <p>
          <strong>📌 Longitude:</strong>{" "}
          {Number(truck.longitude).toFixed(5)}
        </p>

        <p>
          <strong>🕒 Updated:</strong>{" "}
          {truck.last_updated ??
            truck.updated_at ??
            "Just Now"}
        </p>
      </div>
    </Popup>
  );
}