import { FaTruck, FaTemperatureHigh } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import StatCard from "../components/dashboard/StatCard";
import TemperatureChart from "../components/dashboard/TemperatureChart";
import RecentTruckTable from "../components/dashboard/RecentTruckTable";
import AlertTable from "../components/dashboard/AlertTable";

import LiveClock from "../components/common/LiveClock";

import useDashboard from "../hooks/useDashboard";
import useWebSocket from "../hooks/useWebSocket";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const { logout, role } = useAuth();

  const {
    stats,
    trucks,
    alerts,
    loading,
    reload,
    updateTruck,
  } = useDashboard();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAddTruck = () => {
    navigate("/trucks/add");
  };

  const handleManageTrucks = () => {
    navigate("/trucks");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  useWebSocket((message) => {
    console.log("Dashboard WS:", message);

    switch (message.event) {
      case "truck_updated":
        updateTruck(message.truck);

        if (message.truck?.temperature >= 45) {
          toast.warning(
            `🌡️ ${message.truck.truck_id} Temperature: ${message.truck.temperature}°C`
          );
        }
        break;

      case "truck_created":
        reload();

        toast.success(
          `✅ Truck ${message.truck.truck_id} Added Successfully`
        );
        break;

      case "truck_deleted":
        reload();

        toast.info("🗑️ Truck Deleted Successfully");
        break;

      case "alert_created":
        toast.error(
          `🚨 ALERT: ${message.alert.truck_id}\n${message.alert.temperature}°C (${message.alert.level})`,
          {
            autoClose: 5000,
          }
        );

        reload();
        break;

      default:
        break;
    }
  });

  if (loading) {
    return (
      <div
        style={{
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        background: "#111827",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "34px",
              fontWeight: "bold",
            }}
          >
            🚚 Fleet Monitoring Dashboard
          </h1>

          <p
            style={{
              color: "#9CA3AF",
              marginTop: "8px",
            }}
          >
            Real-Time Fleet Monitoring & Analytics
          </p>

          {/* User Role */}
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#1F2937",
              color: "#22C55E",
              padding: "8px 15px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            👤 Logged in as: {role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <LiveClock />

          {/* Admin Only */}
          {role === "Admin" && (
            <>
              <button
                onClick={handleAddTruck}
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ➕ Add Truck
              </button>

              <button
                onClick={handleAdminPanel}
                style={{
                  background: "#7C3AED",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                👤 Admin Panel
              </button>
            </>
          )}

          {/* Admin & Operator */}
          {(role === "Admin" || role === "Operator") && (
            <button
              onClick={handleManageTrucks}
              style={{
                background: "#16A34A",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🚚 Manage Trucks
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: "#EF4444",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Viewer Notice */}
      {role === "Viewer" && (
        <div
          style={{
            background: "#78350F",
            color: "#FCD34D",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
            fontWeight: "bold",
          }}
        >
          👀 You are logged in as a Viewer. You can only view fleet data.
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Total Trucks"
          value={stats.total_trucks || 0}
          subtitle="Connected Vehicles"
          icon={<FaTruck />}
          color="#3B82F6"
        />

        <StatCard
          title="Average Temperature"
          value={`${stats.average_temperature || 0}°C`}
          subtitle="Fleet Average"
          icon={<FaTemperatureHigh />}
          color="#10B981"
        />

        <StatCard
          title="Temperature Alerts"
          value={stats.alert_count || 0}
          subtitle="Critical Vehicles"
          icon={<MdWarning />}
          color="#F59E0B"
        />

        <StatCard
          title="Highest Temperature"
          value={`${stats.highest_temperature || 0}°C`}
          subtitle="Peak Recorded"
          icon={<BsGraphUp />}
          color="#EF4444"
        />
      </div>

      {/* Temperature Chart */}
      <div style={{ marginTop: "35px" }}>
        <TemperatureChart trucks={trucks} />
      </div>

      {/* Recent Trucks */}
      <div style={{ marginTop: "35px" }}>
        <RecentTruckTable trucks={trucks} />
      </div>

      {/* Recent Alerts */}
      <div
        style={{
          marginTop: "35px",
          marginBottom: "30px",
        }}
      >
        <AlertTable alerts={alerts} />
      </div>
    </div>
  );
}