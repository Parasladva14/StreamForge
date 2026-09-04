export default function AnalyticsCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      style={{
        background: "#1F2937",
        borderLeft: `6px solid ${color}`,
        borderRadius: 12,
        padding: 20,
        color: "white",
        boxShadow: "0 10px 20px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          fontSize: 34,
          marginBottom: 10,
        }}
      >
        {icon}
      </div>

      <h4
        style={{
          color: "#D1D5DB",
          marginBottom: 10,
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          margin: 0,
          color,
          fontWeight: "bold",
        }}
      >
        {value}
      </h2>
    </div>
  );
}