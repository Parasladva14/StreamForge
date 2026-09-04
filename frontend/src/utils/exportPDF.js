import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function exportPDF(trucks) {

  if (!trucks || trucks.length === 0) {
    alert("No truck data available to export.");
    return;
  }

  const doc = new jsPDF();

  const total = trucks.length;
  const active = trucks.filter(
    (t) => t.status === "Active"
  ).length;

  const maintenance = trucks.filter(
    (t) => t.status === "Maintenance"
  ).length;

  const inactive = trucks.filter(
    (t) => t.status === "Inactive"
  ).length;

  const averageTemp =
    (
      trucks.reduce(
        (sum, truck) => sum + truck.temperature,
        0
      ) / total
    ).toFixed(1);

  /* ---------- Title ---------- */

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("Fleet Analytics Report", 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(80);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    28
  );

  /* ---------- Summary ---------- */

  doc.setFontSize(14);
  doc.setTextColor(0);

  doc.text("Fleet Summary", 14, 40);

  doc.setFontSize(11);

  doc.text(`Total Trucks : ${total}`, 14, 48);
  doc.text(`Active : ${active}`, 70, 48);
  doc.text(`Maintenance : ${maintenance}`, 120, 48);

  doc.text(`Inactive : ${inactive}`, 14, 56);
  doc.text(`Average Temp : ${averageTemp} °C`, 70, 56);

  /* ---------- Table ---------- */

  autoTable(doc, {
    startY: 65,

    head: [[
      "Truck ID",
      "Driver",
      "Location",
      "Temperature",
      "Status"
    ]],

    body: trucks.map((truck) => [
      truck.truck_id,
      truck.driver_name || "-",
      truck.location,
      `${truck.temperature} °C`,
      truck.status || "-"
    ]),

    theme: "striped",

    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    didParseCell(data) {

      if (
        data.section === "body" &&
        data.column.index === 4
      ) {

        const status = data.cell.raw;

        if (status === "Active") {
          data.cell.styles.textColor = [22, 163, 74];
        }

        if (status === "Maintenance") {
          data.cell.styles.textColor = [245, 158, 11];
        }

        if (status === "Inactive") {
          data.cell.styles.textColor = [220, 38, 38];
        }

      }

    },

    didDrawPage(data) {

      doc.setFontSize(10);

      doc.setTextColor(120);

      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );

    }

  });

  /* ---------- Save ---------- */

  const date = new Date().toISOString().split("T")[0];

  doc.save(`Fleet_Report_${date}.pdf`);
}