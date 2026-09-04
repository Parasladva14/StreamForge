import AnalyticsCard from "./AnalyticsCard";

export default function DashboardCards({ summary }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
      }}
    >
      <AnalyticsCard
        title="Total Trucks"
        value={summary.total_trucks}
        color="#3B82F6"
        icon="🚚"
      />

      <AnalyticsCard
        title="Active Trucks"
        value={summary.active_trucks}
        color="#22C55E"
        icon="✅"
      />

      <AnalyticsCard
        title="Inactive Trucks"
        value={summary.inactive_trucks}
        color="#6B7280"
        icon="❌"
      />

      <AnalyticsCard
        title="Maintenance"
        value={summary.maintenance_trucks}
        color="#F59E0B"
        icon="🔧"
      />

      <AnalyticsCard
        title="Average Temp"
        value={`${summary.average_temperature}°C`}
        color="#06B6D4"
        icon="🌡️"
      />

      <AnalyticsCard
        title="Highest Temp"
        value={`${summary.highest_temperature}°C`}
        color="#DC2626"
        icon="🔥"
      />

      <AnalyticsCard
        title="Critical Alerts"
        value={summary.critical_alerts}
        color="#EF4444"
        icon="🚨"
      />
    </div>
  );
}