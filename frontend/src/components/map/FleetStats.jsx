import "./FleetStats.css";

export default function FleetStats({ trucks = [] }) {
  const total = trucks.length;

  const active = trucks.filter(
    (truck) =>
      String(truck.status || "").toLowerCase() ===
      "active"
  ).length;

  const inactive = trucks.filter(
    (truck) =>
      String(truck.status || "").toLowerCase() ===
      "inactive"
  ).length;

  const maintenance = trucks.filter(
    (truck) =>
      String(truck.status || "").toLowerCase() ===
      "maintenance"
  ).length;

  const stats = [
    {
      title: "Total Trucks",
      value: total,
      icon: "🚛",
      className: "fleet-stat-blue",
    },
    {
      title: "Active",
      value: active,
      icon: "🟢",
      className: "fleet-stat-green",
    },
    {
      title: "Inactive",
      value: inactive,
      icon: "🔴",
      className: "fleet-stat-red",
    },
    {
      title: "Maintenance",
      value: maintenance,
      icon: "🟠",
      className: "fleet-stat-orange",
    },
  ];

  return (
    <div className="fleet-stats">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`fleet-stat-card ${stat.className}`}
        >
          <div className="fleet-stat-icon">
            {stat.icon}
          </div>

          <div>
            <p className="fleet-stat-title">
              {stat.title}
            </p>

            <h2 className="fleet-stat-value">
              {stat.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}