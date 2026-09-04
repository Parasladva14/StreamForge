import { useEffect, useMemo, useState } from "react";

import { getTrucks } from "../services/truckService";

import ReportsSummary from "../components/reports/ReportsSummary";
import ReportsFilter from "../components/reports/ReportsFilter";
import ReportsTable from "../components/reports/ReportsTable";
import ReportPagination from "../components/reports/ReportPagination";
import ReportsToolbar from "../components/reports/ReportsToolbar";

export default function Reports() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("All");

  // Date Filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("truck_id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getTrucks();

      setTrucks(data || []);
    } catch (error) {
      console.error("Failed to load trucks:", error);
    } finally {
      setLoading(false);
    }
  }

  // Reset pagination whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    location,
    fromDate,
    toDate,
    sortField,
    sortOrder,
  ]);

  // Location Dropdown
  const locations = useMemo(() => {
    return [
      "All",
      ...new Set(
        trucks
          .map((truck) => truck.location)
          .filter(Boolean)
      ),
    ];
  }, [trucks]);

  // Filter + Sort
  const filteredTrucks = useMemo(() => {
    const filtered = trucks.filter((truck) => {
      const matchesSearch =
        truck.truck_id
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        truck.driver_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || truck.status === status;

      const matchesLocation =
        location === "All" ||
        truck.location === location;

      const createdDate = truck.created_at
        ? new Date(truck.created_at)
        : null;

      const matchesFrom =
        !fromDate ||
        (createdDate &&
          createdDate >= new Date(fromDate));

      const matchesTo =
        !toDate ||
        (createdDate &&
          createdDate <=
            new Date(toDate + "T23:59:59"));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesFrom &&
        matchesTo
      );
    });

    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField === "temperature") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else if (sortField === "created_at") {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      } else {
        valueA = String(valueA || "").toLowerCase();
        valueB = String(valueB || "").toLowerCase();
      }

      if (valueA < valueB)
        return sortOrder === "asc" ? -1 : 1;

      if (valueA > valueB)
        return sortOrder === "asc" ? 1 : -1;

      return 0;
    });

    return filtered;
  }, [
    trucks,
    search,
    status,
    location,
    fromDate,
    toDate,
    sortField,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredTrucks.length / rowsPerPage
  );

  const currentTrucks = useMemo(() => {
    const start =
      (currentPage - 1) * rowsPerPage;

    return filteredTrucks.slice(
      start,
      start + rowsPerPage
    );
  }, [
    filteredTrucks,
    currentPage,
  ]);

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        📄 Fleet Reports
      </h1>

      {/* Toolbar */}
      <ReportsToolbar
        trucks={filteredTrucks}
      />

      {/* Summary */}
      <ReportsSummary
        trucks={filteredTrucks}
      />

      {/* Filters */}
      <ReportsFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        location={location}
        setLocation={setLocation}
        locations={locations}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      {/* Loading */}
      {loading ? (
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          Loading reports...
        </div>
      ) : (
        <>
          <ReportsTable
            trucks={currentTrucks}
            sortField={sortField}
            sortOrder={sortOrder}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
          />

          <ReportPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}