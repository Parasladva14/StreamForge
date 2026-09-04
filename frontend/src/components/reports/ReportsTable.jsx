import "./ReportsTable.css";

export default function ReportsTable({
  trucks = [],
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}) {
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return " ↕";
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  if (trucks.length === 0) {
    return (
      <div className="reports-empty">
        📄 No reports found.
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Inactive":
        return "status-inactive";
      case "Maintenance":
        return "status-maintenance";
      default:
        return "status-default";
    }
  };

  const getTemperatureClass = (temp) => {
    if (temp >= 45) return "temp-high";
    if (temp >= 35) return "temp-medium";
    return "temp-normal";
  };

  return (
    <div className="reports-table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("truck_id")}>
              Truck ID{getSortIcon("truck_id")}
            </th>

            <th onClick={() => handleSort("driver_name")}>
              Driver{getSortIcon("driver_name")}
            </th>

            <th onClick={() => handleSort("location")}>
              Location{getSortIcon("location")}
            </th>

            <th onClick={() => handleSort("temperature")}>
              Temperature{getSortIcon("temperature")}
            </th>

            <th onClick={() => handleSort("status")}>
              Status{getSortIcon("status")}
            </th>

            <th onClick={() => handleSort("created_at")}>
              Created At{getSortIcon("created_at")}
            </th>
          </tr>
        </thead>

        <tbody>
          {trucks.map((truck) => (
            <tr key={truck.id ?? truck.truck_id}>
              <td>{truck.truck_id}</td>

              <td>{truck.driver_name || "-"}</td>

              <td>{truck.location}</td>

              <td>
                <span
                  className={getTemperatureClass(
                    Number(truck.temperature)
                  )}
                >
                  {truck.temperature} °C
                </span>
              </td>

              <td>
                <span
                  className={`status-badge ${getStatusClass(
                    truck.status
                  )}`}
                >
                  {truck.status}
                </span>
              </td>

              <td>
                {truck.created_at
                  ? new Date(truck.created_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}