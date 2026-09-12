export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  style = {},
  ...props
}) {
  const variantStyles = {
    primary: {
      background: "#2563EB",
      color: "#FFFFFF",
      border: "none",
    },
    secondary: {
      background: "#334155",
      color: "#F8FAFC",
      border: "1px solid #475569",
    },
    success: {
      background: "#16A34A",
      color: "#FFFFFF",
      border: "none",
    },
    danger: {
      background: "#DC2626",
      color: "#FFFFFF",
      border: "none",
    },
    outline: {
      background: "transparent",
      color: "#38BDF8",
      border: "1px solid #38BDF8",
    },
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...selectedVariant,
        ...style,
      }}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
