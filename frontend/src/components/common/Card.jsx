export default function Card({ title, subtitle, children, style = {}, headerAction = null }) {
  return (
    <div
      style={{
        backgroundColor: "#1E293B",
        borderRadius: "12px",
        border: "1px solid #334155",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
        ...style,
      }}
    >
      {(title || subtitle || headerAction) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
