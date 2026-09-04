const cardStyle = (borderColor) => ({
  background: "#1F2937",
  borderRadius: 12,
  padding: 20,
  borderLeft: `6px solid ${borderColor}`,
  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
});

export default function SummaryCards({
  summary,
}) {
  if (!summary) return null;

  const cards = [
    {
      title: "Total Trucks",
      value: summary.total_trucks,
      icon: "🚚",
      color: "#3B82F6",
    },
    {
      title: "Active Trucks",
      value: summary.active_trucks,
      icon: "✅",
      color: "#22C55E",
    },
    {
      title: "Inactive Trucks",
      value: summary.inactive_trucks,
      icon: "❌",
      color: "#6B7280",
    },
    {
      title: "Maintenance",
      value: summary.maintenance_trucks,
      icon: "🔧",
      color: "#F59E0B",
    },
    {
      title: "Average Temperature",
      value: `${summary.average_temperature ?? 0}°C`,
      icon: "🌡️",
      color: "#06B6D4",
    },
    {
      title: "Highest Temperature",
      value: `${summary.highest_temperature ?? 0}°C`,
      icon: "🔥",
      color: "#DC2626",
    },
    {
      title: "Critical Alerts",
      value: summary.critical_alerts,
      icon: "🚨",
      color: "#EF4444",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 30,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={cardStyle(card.color)}
        >
          <div
            style={{
              fontSize: 32,
              marginBottom: 12,
            }}
          >
            {card.icon}
          </div>

          <div
            style={{
              color: "#9CA3AF",
              fontSize: 15,
              marginBottom: 8,
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}