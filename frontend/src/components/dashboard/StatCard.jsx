import React from "react";
import {
  FaTruck,
  FaTemperatureHigh,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

const iconMap = {
  trucks: <FaTruck size={28} />,
  average: <FaChartLine size={28} />,
  highest: <FaTemperatureHigh size={28} />,
  alerts: <FaExclamationTriangle size={28} />,
};

export default function StatCard({
  title,
  value,
  subtitle,
  color = "#3B82F6",
  icon,
}) {
  const renderedIcon = React.isValidElement(icon)
    ? icon
    : typeof icon === "string" && iconMap[icon]
    ? iconMap[icon]
    : null;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        background: "#1E293B",
        borderRadius: 14,
        padding: "22px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #334155",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div>
        <p
          style={{
            color: "#94A3B8",
            margin: 0,
            fontSize: "13px",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            marginTop: "8px",
            marginBottom: "4px",
            color,
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          {value}
        </h2>

        {subtitle && (
          <span
            style={{
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {renderedIcon && (
        <div
          style={{
            color,
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            backgroundColor: `${color}15`,
          }}
        >
          {renderedIcon}
        </div>
      )}
    </div>
  );
}