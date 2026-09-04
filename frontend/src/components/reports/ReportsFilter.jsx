import "./ReportsFilter.css";

export default function ReportsFilter({
  search,
  setSearch,
  status,
  setStatus,
  location,
  setLocation,
  locations,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) {
  return (
    <div className="reports-filter-container">

      {/* Search */}
      <div className="filter-group">
        <label>🔍 Search Truck / Driver</label>

        <input
          type="text"
          placeholder="Truck ID or Driver Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="filter-group">
        <label>📌 Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Location */}
      <div className="filter-group">
        <label>📍 Location</label>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* From Date */}
      <div className="filter-group">
        <label>📅 From Date</label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>

      {/* To Date */}
      <div className="filter-group">
        <label>📅 To Date</label>

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      <div className="filter-group button-group">
        <button
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setStatus("All");
            setLocation("All");
            setFromDate("");
            setToDate("");
          }}
        >
          Clear Filters
        </button>
      </div>

    </div>
  );
}