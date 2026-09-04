import "./ReportsSummary.css";

export default function ReportsSummary({ trucks = [] }) {
  const totalTrucks = trucks.length;

  const activeTrucks = trucks.filter(
    (truck) => truck.status === "Active"
  ).length;

  const inactiveTrucks = trucks.filter(
    (truck) => truck.status === "Inactive"
  ).length;

  const maintenanceTrucks = trucks.filter(
    (truck) => truck.status === "Maintenance"
  ).length;

  const averageTemperature =
    totalTrucks > 0
      ? (
          trucks.reduce(
            (sum, truck) => sum + Number(truck.temperature || 0),
            0
          ) / totalTrucks
        ).toFixed(1)
      : "0.0";

  const highestTemperature =
    totalTrucks > 0
      ? Math.max(...trucks.map((t) => Number(t.temperature || 0)))
      : 0;

  const cards = [
    {
      title: "Total Trucks",
      value: totalTrucks,
      icon: "🚚",
      color: "#2563eb",
    },
    {
      title: "Active",
      value: activeTrucks,
      icon: "✅",
      color: "#16a34a",
    },
    {
      title: "Inactive",
      value: inactiveTrucks,
      icon: "❌",
      color: "#dc2626",
    },
    {
      title: "Maintenance",
      value: maintenanceTrucks,
      icon: "🔧",
      color: "#f59e0b",
    },
    {
      title: "Average Temp",
      value: `${averageTemperature} °C`,
      icon: "🌡️",
      color: "#7c3aed",
    },
    {
      title: "Highest Temp",
      value: `${highestTemperature} °C`,
      icon: "🔥",
      color: "#ea580c",
    },
  ];

  return (
    <div className="reports-summary-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          className="reports-summary-card"
          style={{ borderLeft: `6px solid ${card.color}` }}
        >
          <div className="reports-summary-icon">{card.icon}</div>

          <div>
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}