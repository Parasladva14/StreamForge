import { useEffect, useState } from "react";

import TruckForm from "../components/trucks/TruckForm";
import TruckTable from "../components/trucks/TruckTable";
import EditTruckModal from "../components/trucks/EditTruckModal";
import SearchBar from "../components/trucks/SearchBar";
import StatCard from "../components/dashboard/StatCard";
import Pagination from "../components/common/Pagination";

import {
  getTrucks,
  deleteTruck,
} from "../services/truckService";

import useWebSocket from "../hooks/useWebSocket";

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const trucksPerPage = 5;

  const [selectedTruck, setSelectedTruck] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const data = await getTrucks();
      setTrucks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  useWebSocket((message) => {
    if (
      message.event === "truck_created" ||
      message.event === "truck_updated" ||
      message.event === "truck_deleted"
    ) {
      loadTrucks();
    }
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this truck?")) return;

    try {
      await deleteTruck(id);
    } catch (err) {
      alert("Unable to delete truck.");
    }
  };

  const handleEdit = (truck) => {
    setSelectedTruck(truck);
    setOpenEdit(true);
  };

  // Search + Filter
  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch =
      truck.truck_id.toLowerCase().includes(search.toLowerCase()) ||
      truck.location.toLowerCase().includes(search.toLowerCase()) ||
      (truck.driver_name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      truck.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(
    filteredTrucks.length / trucksPerPage
  );

  const indexOfLastTruck = currentPage * trucksPerPage;

  const indexOfFirstTruck =
    indexOfLastTruck - trucksPerPage;

  const currentTrucks = filteredTrucks.slice(
    indexOfFirstTruck,
    indexOfLastTruck
  );

  // Statistics
  const totalTrucks = trucks.length;

  const averageTemp =
    totalTrucks === 0
      ? 0
      : (
          trucks.reduce(
            (sum, t) => sum + t.temperature,
            0
          ) / totalTrucks
        ).toFixed(1);

  const highestTemp =
    totalTrucks === 0
      ? 0
      : Math.max(...trucks.map((t) => t.temperature));

  const alerts = trucks.filter(
    (t) => t.temperature > 40
  ).length;

  const active = trucks.filter(
    (t) => t.status === "Active"
  ).length;

  const maintenance = trucks.filter(
    (t) => t.status === "Maintenance"
  ).length;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#111827",
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Loading Trucks...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        padding: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1 style={{ color: "white" }}>
          🚚 Truck Management
        </h1>

        <button
          className="btn btn-primary"
          onClick={loadTrucks}
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <StatCard
          title="Total Trucks"
          value={totalTrucks}
          color="#3B82F6"
        />

        <StatCard
          title="Active Trucks"
          value={active}
          color="#22C55E"
        />

        <StatCard
          title="Maintenance"
          value={maintenance}
          color="#F59E0B"
        />

        <StatCard
          title="Alerts"
          value={alerts}
          color="#EF4444"
        />

        <StatCard
          title="Average Temp"
          value={`${averageTemp}°C`}
          color="#06B6D4"
        />

        <StatCard
          title="Highest Temp"
          value={`${highestTemp}°C`}
          color="#DC2626"
        />
      </div>

      {/* Add Truck */}

      <TruckForm onSuccess={loadTrucks} />

      {/* Search */}

      <SearchBar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      {/* Status Filter */}

      <div
        style={{
          marginTop: 15,
          marginBottom: 20,
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Maintenance</option>
        </select>
      </div>

      {/* Table */}

      <TruckTable
        trucks={currentTrucks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EditTruckModal
        open={openEdit}
        truck={selectedTruck}
        onClose={() => {
          setOpenEdit(false);
          setSelectedTruck(null);
        }}
        onSuccess={loadTrucks}
      />
    </div>
  );
}