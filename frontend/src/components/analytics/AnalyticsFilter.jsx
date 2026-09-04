export default function AnalyticsFilter({
  locations,
  selectedLocation,
  setSelectedLocation,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
        flexWrap: "wrap",
      }}
    >
      <div>
        <label
          style={{
            display: "block",
            color: "#D1D5DB",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          📍 Filter by Location
        </label>

        <select
          value={selectedLocation}
          onChange={(e) =>
            setSelectedLocation(e.target.value)
          }
          style={{
            minWidth: 220,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #374151",
            background: "#1F2937",
            color: "white",
            fontSize: 15,
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Locations</option>

          {locations.map((location) => (
            <option
              key={location}
              value={location}
            >
              {location}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setSelectedLocation("")}
        disabled={!selectedLocation}
        style={{
          marginTop: 24,
          padding: "10px 18px",
          border: "none",
          borderRadius: 8,
          background: selectedLocation
            ? "#EF4444"
            : "#6B7280",
          color: "white",
          cursor: selectedLocation
            ? "pointer"
            : "not-allowed",
          transition: "0.3s",
        }}
      >
        Clear Filter
      </button>

      <div
        style={{
          marginTop: 24,
          color: "#9CA3AF",
          fontSize: 14,
        }}
      >
        Available Locations: <strong>{locations.length}</strong>
      </div>
    </div>
  );
}