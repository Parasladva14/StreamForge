import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getUserEmail } from "../../utils/jwt";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const userEmail = getUserEmail() || "User";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleBadgeColor = (userRole) => {
    switch (userRole) {
      case "Admin":
        return { bg: "#7C3AED", text: "#EDE9FE" };
      case "Operator":
        return { bg: "#0D9488", text: "#CCFBF1" };
      default:
        return { bg: "#475569", text: "#F1F5F9" };
    }
  };

  const badgeStyle = getRoleBadgeColor(role);

  return (
    <header
      style={{
        height: "60px",
        backgroundColor: "#0F172A",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #334155",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          🚚 StreamForge
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#94A3B8",
            }}
          >
            {userEmail}
          </span>

          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "12px",
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              letterSpacing: "0.5px",
            }}
          >
            {role || "Viewer"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#DC2626",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;