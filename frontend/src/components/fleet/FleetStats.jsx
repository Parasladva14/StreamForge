import "./FleetStats.css";

export default function FleetStats({ trucks }) {

    const total = trucks.length;

    const active = trucks.filter(
        truck => truck.status === "normal"
    ).length;

    const warning = trucks.filter(
        truck => truck.status === "warning"
    ).length;

    const critical = trucks.filter(
        truck => truck.status === "critical"
    ).length;

    return (

        <div className="fleet-stats">

            <div className="stat-card">

                <h3>Total Trucks</h3>

                <h2>{total}</h2>

            </div>

            <div className="stat-card">

                <h3>Active</h3>

                <h2>{active}</h2>

            </div>

            <div className="stat-card warning">

                <h3>Warning</h3>

                <h2>{warning}</h2>

            </div>

            <div className="stat-card critical">

                <h3>Critical</h3>

                <h2>{critical}</h2>

            </div>

        </div>

    );

}