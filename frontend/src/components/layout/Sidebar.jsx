import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTruck,
  FaMapMarkedAlt,
  FaChartBar,
  FaFileAlt,
  FaBell,
  FaGlobeAmericas,
  FaCog,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { role } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/trucks", label: "Trucks", icon: <FaTruck /> },
    { to: "/fleet-map", label: "Live Fleet Map", icon: <FaMapMarkedAlt /> },
    { to: "/analytics", label: "Analytics", icon: <FaChartBar /> },
    { to: "/reports", label: "Reports", icon: <FaFileAlt /> },
    { to: "/notifications", label: "Notifications", icon: <FaBell /> },
    { to: "/geofences", label: "Geofences", icon: <FaGlobeAmericas /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  if (role === "Admin") {
    navItems.push({ to: "/admin", label: "Admin Panel", icon: <FaUserShield /> });
  }

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#1E293B",
        color: "white",
        minHeight: "calc(100vh - 60px)",
        padding: "20px 14px",
        boxSizing: "border-box",
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#94A3B8",
            fontWeight: "bold",
            padding: "0 10px 12px",
          }}
        >
          Navigation
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                color: isActive ? "#FFFFFF" : "#94A3B8",
                backgroundColor: isActive ? "#2563EB" : "transparent",
                textDecoration: "none",
                fontWeight: isActive ? "600" : "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              })}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid #334155",
          fontSize: "12px",
          color: "#64748B",
        }}
      >
        StreamForge v1.0.0
      </div>
    </aside>
  );
}

export default Sidebar;