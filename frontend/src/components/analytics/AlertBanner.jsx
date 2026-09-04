export default function AlertBanner({ trucks }) {
  const criticalTrucks = trucks.filter(
    (truck) => truck.temperature >= 45
  );

  if (criticalTrucks.length === 0) {
    return (
      <div
        style={{
          background: "#065F46",
          color: "white",
          padding: 18,
          borderRadius: 12,
          marginBottom: 25,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>✅</span>

        <div>
          <strong>Fleet Status: Normal</strong>

          <div
            style={{
              fontSize: 14,
              opacity: 0.9,
              marginTop: 4,
            }}
          >
            No trucks are currently reporting critical temperatures.
          </div>
        </div>
      </div>
    );
  }

  const hottestTruck = criticalTrucks.reduce((max, truck) =>
    truck.temperature > max.temperature ? truck : max
  );

  return (
    <div
      style={{
        background: "#991B1B",
        color: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 25,
        boxShadow: "0 6px 16px rgba(0,0,0,.3)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 12,
        }}
      >
        🚨 Critical Temperature Alert
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 15,
        }}
      >
        <div>
          <strong>Critical Trucks</strong>

          <p
            style={{
              marginTop: 6,
              fontSize: 22,
            }}
          >
            {criticalTrucks.length}
          </p>
        </div>

        <div>
          <strong>Highest Temperature</strong>

          <p
            style={{
              marginTop: 6,
              fontSize: 22,
            }}
          >
            {hottestTruck.temperature}°C
          </p>
        </div>

        <div>
          <strong>Truck ID</strong>

          <p
            style={{
              marginTop: 6,
              fontSize: 18,
            }}
          >
            {hottestTruck.truck_id}
          </p>
        </div>

        <div>
          <strong>Location</strong>

          <p
            style={{
              marginTop: 6,
              fontSize: 18,
            }}
          >
            {hottestTruck.location}
          </p>
        </div>
      </div>
    </div>
  );
}