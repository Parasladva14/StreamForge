import "./RouteStatistics.css";

export default function RouteStatistics({
  route = [],
}) {
  if (!route.length) return null;

  const speeds = route.map((p) => p.speed);

  const avgSpeed = (
    speeds.reduce((a, b) => a + b, 0) /
    speeds.length
  ).toFixed(1);

  const maxSpeed = Math.max(...speeds);

  const duration =
    route.length > 1
      ? (
          (new Date(
            route[route.length - 1].timestamp
          ) -
            new Date(route[0].timestamp)) /
          60000
        ).toFixed(0)
      : 0;

  return (
    <div className="route-stats">

      <h3>Trip Statistics</h3>

      <div className="stat-card">

        <p>
          <strong>Total GPS Points</strong>
        </p>

        <h2>{route.length}</h2>

      </div>

      <div className="stat-card">

        <p>
          <strong>Average Speed</strong>
        </p>

        <h2>{avgSpeed} km/h</h2>

      </div>

      <div className="stat-card">

        <p>
          <strong>Maximum Speed</strong>
        </p>

        <h2>{maxSpeed} km/h</h2>

      </div>

      <div className="stat-card">

        <p>
          <strong>Trip Duration</strong>
        </p>

        <h2>{duration} min</h2>

      </div>

    </div>
  );
}