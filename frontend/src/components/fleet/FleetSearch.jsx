import "./FleetSearch.css";

export default function FleetSearch({
  search,
  setSearch,
}) {
  return (
    <div className="fleet-search">
      <input
        type="text"
        placeholder="Search by Truck ID or Driver..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}