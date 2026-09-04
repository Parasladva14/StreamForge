import "./TruckDetails.css";

export default function TruckDetails({
  truck,
  onClose,
}) {
  if (!truck) return null;

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
    <div className="truck-details">
      <div className="details-header">
        <h2>🚚 Truck Details</h2>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="details-body">

        {/* Truck Information */}

        <div className="detail-item">
          <span>Truck ID</span>
          <strong>{truck.truck_no}</strong>
        </div>

        <div className="detail-item">
          <span>Driver</span>
          <strong>{truck.driver}</strong>
        </div>

        {/* Status */}

        <div className="detail-item">
          <span>Status</span>

          <span
            className="status-badge"
            style={{
              background: getStatusColor(truck.status),
            }}
          >
            {truck.status}
          </span>
        </div>

        {/* Speed */}

        <div className="detail-item">
          <span>Speed</span>
          <strong>{truck.speed} km/h</strong>
        </div>

        {/* Temperature */}

        <div className="detail-item">
          <span>Temperature</span>
          <strong>
            {truck.temperature ?? "--"} °C
          </strong>
        </div>

        {/* Fuel */}

        <div className="detail-item">
          <span>Fuel</span>
          <strong>{truck.fuel ?? "--"}%</strong>
        </div>

        <div className="fuel-bar">
          <div
            className="fuel-fill"
            style={{
              width: `${truck.fuel ?? 0}%`,
            }}
          />
        </div>

        {/* GPS */}

        <div className="detail-item">
          <span>Latitude</span>
          <strong>{truck.latitude}</strong>
        </div>

        <div className="detail-item">
          <span>Longitude</span>
          <strong>{truck.longitude}</strong>
        </div>

        {/* Last Update */}

        <div className="detail-item">
          <span>Last Updated</span>

          <strong>
            {truck.last_updated ??
              truck.updated_at ??
              "Just Now"}
          </strong>
        </div>

        {/* Optional Telemetry */}

        <div className="detail-item">
          <span>Engine</span>

          <strong>
            {truck.engine_status ?? "Running"}
          </strong>
        </div>

        <div className="detail-item">
          <span>Battery</span>

          <strong>
            {truck.battery ?? "100"}%
          </strong>
        </div>

      </div>
    </div>
  );
}