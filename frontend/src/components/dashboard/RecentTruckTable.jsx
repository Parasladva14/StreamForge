export default function RecentTruckTable({ trucks = [] }) {
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
        Recent Trucks
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
            <th>Truck ID</th>
            <th>Location</th>
            <th>Temperature</th>
          </tr>
        </thead>

        <tbody>
          {trucks.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No Trucks Found
              </td>
            </tr>
          ) : (
            trucks.map((truck) => (
              <tr key={truck.id}>
                <td>{truck.id}</td>
                <td>{truck.truck_id}</td>
                <td>{truck.location}</td>
                <td>{truck.temperature} °C</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}