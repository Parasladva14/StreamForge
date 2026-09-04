import { FaBars } from "react-icons/fa";

function Navbar() {
  return (
    <header
      style={{
        height: "60px",
        backgroundColor: "#1e293b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <FaBars
          size={24}
          style={{
            cursor: "pointer",
          }}
        />

        <h2
          style={{
            margin: 0,
          }}
        >
          🚚 StreamForge
        </h2>
      </div>

      <div>Admin</div>
    </header>
  );
}

export default Navbar;