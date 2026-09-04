import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentTrucks,
  getAlerts,
} from "../services/dashboardService";

export default function useDashboard() {
  const [stats, setStats] = useState({
    total_trucks: 0,
    average_temperature: 0,
    highest_temperature: 0,
    alert_count: 0,
  });

  const [trucks, setTrucks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [statsData, trucksData, alertsData] = await Promise.all([
        getDashboardStats(),
        getRecentTrucks(),
        getAlerts(),
      ]);

      setStats(statsData || {});
      setTrucks(trucksData || []);
      setAlerts(alertsData || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update truck locally without reloading the dashboard
  const updateTruck = (truck) => {
    setTrucks((prevTrucks) => {
      const updatedTrucks = prevTrucks.map((t) =>
        t.id === truck.id ? { ...t, ...truck } : t
      );

      const temperatures = updatedTrucks.map((t) => t.temperature);

      setStats((prevStats) => ({
        ...prevStats,
        average_temperature:
          temperatures.length > 0
            ? Number(
                (
                  temperatures.reduce((sum, temp) => sum + temp, 0) /
                  temperatures.length
                ).toFixed(1)
              )
            : 0,
        highest_temperature:
          temperatures.length > 0
            ? Math.max(...temperatures)
            : 0,
        alert_count: updatedTrucks.filter(
          (t) => t.temperature >= 45
        ).length,
      }));

      return updatedTrucks;
    });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    stats,
    trucks,
    alerts,
    loading,
    reload: loadDashboard,
    updateTruck,
  };
}