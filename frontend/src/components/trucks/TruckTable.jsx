import {
  FaEdit,
  FaTrash,
  FaCircle,
  FaUser,
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function TruckTable({
  trucks,
  onEdit,
  onDelete,
}) {
  const getTemperatureStatus = (temperature) => {
    if (temperature >= 45) {
      return {
        text: "Critical",
        color: "#DC2626",
      };
    }

    if (temperature >= 35) {
      return {
        text: "Warning",
        color: "#F59E0B",
      };
    }

    return {
      text: "Normal",
      color: "#22C55E",
    };
  };

  const getTruckStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#22C55E";

      case "Maintenance":
        return "#F59E0B";

      case "Inactive":
        return "#6B7280";

      default:
        return "#3B82F6";
    }
  };

  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: 15,
        padding: 20,
        overflowX: "auto",
        boxShadow: "0 10px 20px rgba(0,0,0,.25)",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        🚚 Fleet Monitoring
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#374151",
            }}
          >
            <th style={headerStyle}>ID</th>
            <th style={headerStyle}>Truck</th>
            <th style={headerStyle}>Driver</th>
            <th style={headerStyle}>Location</th>
            <th style={headerStyle}>Temperature</th>
            <th style={headerStyle}>Truck Status</th>
            <th style={headerStyle}>Health</th>
            <th style={headerStyle}>Created</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trucks.length > 0 ? (
            trucks.map((truck) => {
              const tempStatus = getTemperatureStatus(
                truck.temperature
              );

              return (
                <tr
                  key={truck.id}
                  style={{
                    borderBottom: "1px solid #374151",
                  }}
                >
                  <td style={cellStyle}>
                    {truck.id}
                  </td>

                  <td style={cellStyle}>
                    <FaTruck />{" "}
                    <strong>{truck.truck_id}</strong>
                  </td>

                  <td style={cellStyle}>
                    <FaUser />{" "}
                    {truck.driver_name}
                  </td>

                  <td style={cellStyle}>
                    <FaMapMarkerAlt />{" "}
                    {truck.location}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background: tempStatus.color,
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {truck.temperature}°C
                    </span>
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background:
                          getTruckStatusColor(
                            truck.status
                          ),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {truck.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        color: tempStatus.color,
                        fontWeight: "bold",
                      }}
                    >
                      {tempStatus.text}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {truck.created_at
                      ? new Date(
                          truck.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={cellStyle}>
                    <button
                      onClick={() =>
                        onEdit(truck)
                      }
                      style={editButton}
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(truck.id)
                      }
                      style={deleteButton}
                    >
                      <FaTrash />
                    </button>

                    <span
                      style={{
                        color: "#22C55E",
                        marginLeft: 15,
                      }}
                    >
                      <FaCircle size={10} /> Live
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={9}
                style={{
                  padding: 30,
                  textAlign: "center",
                  color: "#9CA3AF",
                }}
              >
                🚛 No Trucks Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  padding: 15,
  textAlign: "left",
};

const cellStyle = {
  padding: 15,
};

const editButton = {
  background: "#2563EB",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  marginRight: 10,
};

const deleteButton = {
  background: "#DC2626",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};