import "./FleetFilter.css";

export default function FleetFilter({
  filter,
  setFilter,
}) {
  return (
    <div className="fleet-filter">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Trucks</option>
        <option value="normal">Normal</option>
        <option value="warning">Warning</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
}