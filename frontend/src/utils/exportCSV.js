export default function exportCSV(trucks) {

  if (!trucks || trucks.length === 0) {
    alert("No truck data available to export.");
    return;
  }

  const headers = [
    "Truck ID",
    "Driver Name",
    "Location",
    "Temperature (°C)",
    "Status",
    "Created At",
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";

    const stringValue = String(value).replace(/"/g, '""');

    return `"${stringValue}"`;
  };

  const rows = trucks.map((truck) => [
    escapeCSV(truck.truck_id),
    escapeCSV(truck.driver_name),
    escapeCSV(truck.location),
    escapeCSV(truck.temperature),
    escapeCSV(truck.status),
    escapeCSV(
      truck.created_at
        ? new Date(truck.created_at).toLocaleString()
        : "-"
    ),
  ]);

  const generatedAt = new Date().toLocaleString();

  const csvContent = [
    [`Fleet Monitoring Report`],
    [`Generated On`, generatedAt],
    [],
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  const date = new Date().toISOString().split("T")[0];

  link.download = `Fleet_Report_${date}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}