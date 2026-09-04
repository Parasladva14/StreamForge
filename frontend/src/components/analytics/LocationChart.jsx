import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function LocationChart({ trucks }) {

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
        <h3>📍 Truck Distribution by Location</h3>
        <p>No truck data available.</p>
      </div>
    );
  }

  const locationMap = {};

  trucks.forEach((truck) => {
    locationMap[truck.location] =
      (locationMap[truck.location] || 0) + 1;
  });

  const labels = Object.keys(locationMap);
  const values = Object.values(locationMap);

  const colors = values.map((count) => {
    if (count >= 10) return "#EF4444";
    if (count >= 5) return "#F59E0B";
    return "#3B82F6";
  });

  const data = {
    labels,

    datasets: [
      {
        label: "Number of Trucks",

        data: values,

        backgroundColor: colors,

        borderRadius: 8,

        borderWidth: 1,
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

        title: {
          display: true,
          text: "Location",
          color: "#fff",
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
          text: "Truck Count",
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
        📍 Truck Distribution by Location
      </h3>

      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}