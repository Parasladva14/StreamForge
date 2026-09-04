export default function AlertTable({ alerts = [] }) {
  return (
    <div
      style={{
        background: "#1F2937",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Recent Alerts
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Truck</th>
            <th>Temperature</th>
            <th>Level</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No Alerts
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.id}</td>

                <td>{alert.truck_id}</td>

                <td>{alert.temperature}°C</td>

                <td>
                  <span
                    style={{
                      background:
                        alert.level === "Critical"
                          ? "#EF4444"
                          : "#F59E0B",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {alert.level}
                  </span>
                </td>

                <td>{alert.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}