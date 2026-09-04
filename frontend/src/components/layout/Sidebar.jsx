import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside
            style={{
                width: "220px",
                backgroundColor: "#334155",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <h3>Menu</h3>

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    marginTop: "20px",
                }}
            >
                <Link to="/" style={{ color: "white" }}>
                    Dashboard
                </Link>

                <Link to="/trucks" style={{ color: "white" }}>
                    Trucks
                </Link>

                <Link to="/analytics" style={{ color: "white" }}>
                    Analytics
                </Link>

                <Link to="/settings" style={{ color: "white" }}>
                    Settings
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;