import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaCog,
  FaThermometerHalf,
  FaTachometerAlt,
  FaGasPump,
  FaUserCircle,
  FaServer,
  FaSave,
  FaUndo,
  FaBroadcastTower,
  FaDatabase,
  FaShieldAlt,
} from "react-icons/fa";

const DEFAULT_SETTINGS = {
  tempAlertMin: -5,
  tempAlertMax: 45,
  speedLimit: 120,
  fuelAlertThreshold: 15,
  simulatorInterval: 5,
  simulatorEnabled: true,
  autoRefreshDashboard: true,
  refreshIntervalSec: 10,
};

function Settings() {
  const { role, email } = useAuth();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("streamforge_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    localStorage.setItem("streamforge_settings", JSON.stringify(settings));
    setIsDirty(false);
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("streamforge_settings");
    setIsDirty(false);
    toast.info("Settings reset to defaults");
  };

  const getRoleBadge = () => {
    const colors = {
      Admin: { bg: "#7C3AED", text: "#EDE9FE" },
      Operator: { bg: "#0D9488", text: "#CCFBF1" },
      Viewer: { bg: "#475569", text: "#F1F5F9" },
    };
    const c = colors[role] || colors.Viewer;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          backgroundColor: c.bg,
          color: c.text,
        }}
      >
        {role || "Viewer"}
      </span>
    );
  };

  // Section Card wrapper
  const SectionCard = ({ icon, title, subtitle, children }) => (
    <div
      style={{
        backgroundColor: "#1E293B",
        borderRadius: "12px",
        border: "1px solid #334155",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid #334155",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h3 style={{ color: "#F8FAFC", fontSize: "16px", fontWeight: "600", margin: 0 }}>{title}</h3>
          {subtitle && (
            <p style={{ color: "#94A3B8", fontSize: "12px", margin: "2px 0 0" }}>{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );

  // Labeled input
  const SettingRow = ({ label, description, children }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid rgba(51,65,85,0.5)",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ color: "#F8FAFC", fontSize: "14px", fontWeight: "500" }}>{label}</div>
        {description && (
          <div style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>{description}</div>
        )}
      </div>
      <div style={{ flexShrink: 0, marginLeft: "16px" }}>{children}</div>
    </div>
  );

  // Toggle switch
  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: checked ? "#3B82F6" : "#475569",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s ease",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

  // Number input
  const NumberInput = ({ value, onChange, min, max, step = 1, unit = "" }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        style={{
          width: "80px",
          padding: "6px 10px",
          backgroundColor: "#0F172A",
          color: "#F8FAFC",
          border: "1px solid #334155",
          borderRadius: "6px",
          fontSize: "14px",
          textAlign: "center",
        }}
      />
      {unit && <span style={{ color: "#64748B", fontSize: "12px" }}>{unit}</span>}
    </div>
  );

  // Status dot
  const StatusDot = ({ color = "#22C55E", label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      <span style={{ color: "#94A3B8", fontSize: "13px" }}>{label}</span>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: "960px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#F8FAFC",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaCog style={{ color: "#3B82F6" }} /> Settings
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "14px", marginTop: "4px" }}>
            Configure fleet monitoring thresholds and system preferences
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #475569",
              backgroundColor: "transparent",
              color: "#94A3B8",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <FaUndo /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isDirty ? "#3B82F6" : "#334155",
              color: isDirty ? "#FFFFFF" : "#64748B",
              fontSize: "13px",
              fontWeight: "600",
              cursor: isDirty ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Profile Card */}
        <SectionCard icon={<FaUserCircle />} title="Profile" subtitle="Your account information">
          <SettingRow label="Email">
            <span style={{ color: "#94A3B8", fontSize: "14px" }}>{email || "—"}</span>
          </SettingRow>
          <SettingRow label="Role">
            {getRoleBadge()}
          </SettingRow>
          <SettingRow label="Session">
            <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: "500" }}>Active</span>
          </SettingRow>
        </SectionCard>

        {/* System Status Card */}
        <SectionCard icon={<FaServer />} title="System Status" subtitle="Infrastructure health overview">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "4px 0" }}>
            <StatusDot color="#22C55E" label="FastAPI Backend — Running" />
            <StatusDot color="#22C55E" label="MySQL Database — Connected" />
            <StatusDot color="#22C55E" label="WebSocket — Active" />
            <StatusDot color="#F59E0B" label="Kafka Broker — Optional" />
            <StatusDot color="#22C55E" label="Truck Simulator — Running" />
          </div>
        </SectionCard>

        {/* Fleet Alert Thresholds */}
        <SectionCard
          icon={<FaThermometerHalf />}
          title="Alert Thresholds"
          subtitle="Temperature, speed, and fuel alert limits"
        >
          <SettingRow label="Min Temperature" description="Alert below this temperature">
            <NumberInput
              value={settings.tempAlertMin}
              onChange={(v) => handleChange("tempAlertMin", v)}
              min={-30}
              max={settings.tempAlertMax - 1}
              unit="°C"
            />
          </SettingRow>
          <SettingRow label="Max Temperature" description="Alert above this temperature">
            <NumberInput
              value={settings.tempAlertMax}
              onChange={(v) => handleChange("tempAlertMax", v)}
              min={settings.tempAlertMin + 1}
              max={80}
              unit="°C"
            />
          </SettingRow>
          <SettingRow label="Speed Limit" description="Trigger overspeeding alert">
            <NumberInput
              value={settings.speedLimit}
              onChange={(v) => handleChange("speedLimit", v)}
              min={40}
              max={200}
              unit="km/h"
            />
          </SettingRow>
          <SettingRow label="Fuel Alert Level" description="Alert when fuel drops below">
            <NumberInput
              value={settings.fuelAlertThreshold}
              onChange={(v) => handleChange("fuelAlertThreshold", v)}
              min={5}
              max={50}
              unit="%"
            />
          </SettingRow>
        </SectionCard>

        {/* Simulator Controls */}
        <SectionCard
          icon={<FaBroadcastTower />}
          title="Simulator Controls"
          subtitle="Truck telemetry simulation settings"
        >
          <SettingRow label="Simulator Enabled" description="Toggle real-time truck data simulation">
            <Toggle
              checked={settings.simulatorEnabled}
              onChange={(v) => handleChange("simulatorEnabled", v)}
            />
          </SettingRow>
          <SettingRow label="Update Interval" description="Seconds between simulator ticks">
            <NumberInput
              value={settings.simulatorInterval}
              onChange={(v) => handleChange("simulatorInterval", v)}
              min={1}
              max={60}
              unit="sec"
            />
          </SettingRow>
          <SettingRow label="Auto-Refresh Dashboard" description="Automatically refresh live data">
            <Toggle
              checked={settings.autoRefreshDashboard}
              onChange={(v) => handleChange("autoRefreshDashboard", v)}
            />
          </SettingRow>
          <SettingRow label="Refresh Interval" description="Dashboard auto-refresh period">
            <NumberInput
              value={settings.refreshIntervalSec}
              onChange={(v) => handleChange("refreshIntervalSec", v)}
              min={3}
              max={120}
              unit="sec"
            />
          </SettingRow>
        </SectionCard>

        {/* Security & Data */}
        <div style={{ gridColumn: "1 / -1" }}>
          <SectionCard
            icon={<FaShieldAlt />}
            title="Security & Data"
            subtitle="Authentication and data management information"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                { label: "Auth Method", value: "JWT (HS256)", color: "#22C55E" },
                { label: "Token Expiry", value: "24 hours", color: "#3B82F6" },
                { label: "Password Hashing", value: "bcrypt", color: "#A78BFA" },
                { label: "CORS Policy", value: "Localhost Only", color: "#F59E0B" },
                { label: "Database Engine", value: "MySQL 8.0", color: "#3B82F6" },
                { label: "ORM", value: "SQLAlchemy", color: "#22C55E" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    backgroundColor: "#0F172A",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    border: "1px solid #334155",
                  }}
                >
                  <div style={{ color: "#64748B", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {item.label}
                  </div>
                  <div style={{ color: item.color, fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          color: "#475569",
          fontSize: "12px",
        }}
      >
        StreamForge Fleet Monitoring System v1.0.0 — Settings are stored locally in your browser.
      </div>
    </div>
  );
}

export default Settings;