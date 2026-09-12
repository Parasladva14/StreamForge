export default function Loader({ message = "Loading data...", size = 40 }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: "16px",
        color: "#94A3B8",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "4px solid #334155",
          borderTop: "4px solid #3B82F6",
          borderRadius: "50%",
          animation: "streamforge-spin 1s linear infinite",
        }}
      />
      {message && <p style={{ fontSize: "14px", fontWeight: "500" }}>{message}</p>}
      <style>{`
        @keyframes streamforge-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
