import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login: saveLogin, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("admin@streamforge.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(email, password);
      saveLogin(response.access_token);
      toast.success("Welcome to StreamForge!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Invalid credentials. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🚚 StreamForge</div>
          <p className="login-subtitle">Fleet Monitoring & Telemetry Platform</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@streamforge.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Fleet"}
          </button>
        </form>

        <div className="demo-credentials-section">
          <p className="demo-title">Quick Demo Login (Pre-configured Roles)</p>
          <div className="demo-role-buttons">
            <button
              type="button"
              className="demo-btn admin"
              onClick={() => setDemoRole("admin@streamforge.com", "admin123")}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="demo-btn operator"
              onClick={() => setDemoRole("operator@streamforge.com", "operator123")}
            >
              🔧 Operator
            </button>
            <button
              type="button"
              className="demo-btn viewer"
              onClick={() => setDemoRole("viewer@streamforge.com", "viewer123")}
            >
              👁️ Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}