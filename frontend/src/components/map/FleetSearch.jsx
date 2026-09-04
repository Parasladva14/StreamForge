import "./FleetSearch.css";

export default function FleetSearch({
  search,
  setSearch,
}) {
  return (
    <div className="fleet-search">
      <span className="fleet-search-icon">
        🔍
      </span>

      <input
        type="text"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search truck or driver..."
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="fleet-search-clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}