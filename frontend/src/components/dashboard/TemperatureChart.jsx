import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TemperatureChart({ trucks = [] }) {
  const data = {
    labels: trucks.map((truck) => truck.truck_id),
    datasets: [
      {
        label: "Temperature",
        data: trucks.map((truck) => truck.temperature),
        borderColor: "#3B82F6",
        backgroundColor: "#60A5FA",
        tension: 0.4,
      },
    ],
  };

  return (
    <div
      style={{
        background: "#1F2937",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Truck Temperature
      </h2>

      <Line data={data} />
    </div>
  );
}