import {
  FaTruck,
  FaTemperatureHigh,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

const icons = {
  trucks: <FaTruck size={30} />,
  average: <FaChartLine size={30} />,
  highest: <FaTemperatureHigh size={30} />,
  alerts: <FaExclamationTriangle size={30} />,
};

export default function StatsCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        background: "#1F2937",
        borderRadius: 16,
        padding: 25,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 20px rgba(0,0,0,.25)",
      }}
    >
      <div>
        <p
          style={{
            color: "#9CA3AF",
            margin: 0,
            fontSize: 14,
          }}
        >
          {title}
        </p>

        <h2
          style={{
            marginTop: 10,
            color,
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          color,
        }}
      >
        {icons[icon]}
      </div>
    </div>
  );
}