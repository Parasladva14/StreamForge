import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

export default function LastUpdated() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      <FaSyncAlt
        style={{
          color: "#3B82F6",
        }}
      />

      <span>
        <strong>Last Updated:</strong>{" "}
        {lastUpdated.toLocaleDateString()}{" "}
        {lastUpdated.toLocaleTimeString()}
      </span>

      <span
        style={{
          background: "#065F46",
          color: "#10B981",
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        ● Live
      </span>
    </div>
  );
}