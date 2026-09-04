import "./FleetFilter.css";

export default function FleetFilter({
  filter,
  setFilter,
}) {
  return (
    <div className="fleet-filter">
      <label htmlFor="fleet-status-filter">
        Status
      </label>

      <select
        id="fleet-status-filter"
        value={filter}
        onChange={(event) =>
          setFilter(event.target.value)
        }
      >
        <option value="All">
          All Trucks
        </option>

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>

        <option value="Maintenance">
          Maintenance
        </option>
      </select>
    </div>
  );
}