export default function SearchBar({
  search,
  setSearch,
}) {
  return (
    <input
      type="text"
      placeholder="Search Truck ID or Location..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        margin: "20px 0",
        borderRadius: "8px",
        border: "1px solid #374151",
        background: "#1F2937",
        color: "white",
        fontSize: "16px",
      }}
    />
  );
}