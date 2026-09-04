import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function TemperaturePieChart({ trucks }) {

  if (!trucks || trucks.length === 0) {
    return (
      <div
        style={{
          background: "#1F2937",
          borderRadius: 12,
          padding: 20,
          color: "white",
          textAlign: "center",
        }}
      >
        <h3>🥧 Temperature Distribution</h3>
        <p>No truck data available.</p>
      </div>
    );
  }

  const normal = trucks.filter(
    (t) => t.temperature < 35
  ).length;

  const warning = trucks.filter(
    (t) =>
      t.temperature >= 35 &&
      t.temperature < 45
  ).length;

  const critical = trucks.filter(
    (t) => t.temperature >= 45
  ).length;

  const data = {
    labels: [
      "Normal",
      "Warning",
      "Critical",
    ],

    datasets: [
      {
        label: "Truck Status",

        data: [
          normal,
          warning,
          critical,
        ],

        backgroundColor: [
          "#22C55E",
          "#F59E0B",
          "#EF4444",
        ],

        borderColor: "#111827",

        borderWidth: 2,

        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#D1D5DB",
          padding: 20,
          font: {
            size: 13,
          },
        },
      },

      tooltip: {
        backgroundColor: "#111827",

        titleColor: "#fff",

        bodyColor: "#fff",

        padding: 12,
      },
    },

    cutout: "55%",
  };

  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        height: 420,
      }}
    >
      <h3
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        🥧 Temperature Distribution
      </h3>

      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}