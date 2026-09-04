import {
  Line,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function TemperatureLineChart({ trucks }) {

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
        <h3>🌡 Temperature Trend</h3>
        <p>No truck data available.</p>
      </div>
    );
  }

  const data = {
    labels: trucks.map((truck) => truck.truck_id),

    datasets: [
      {
        label: "Temperature (°C)",

        data: trucks.map((truck) => truck.temperature),

        borderColor: "#3B82F6",

        backgroundColor: "rgba(59,130,246,0.2)",

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 8,

        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",

        titleColor: "#fff",

        bodyColor: "#fff",

        padding: 12,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#D1D5DB",
        },

        grid: {
          color: "#374151",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#D1D5DB",
        },

        grid: {
          color: "#374151",
        },

        title: {
          display: true,

          text: "Temperature (°C)",

          color: "#fff",
        },
      },
    },
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
        🌡 Temperature Trend
      </h3>

      <Line
        data={data}
        options={options}
      />
    </div>
  );
}