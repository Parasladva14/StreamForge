import { useState } from "react";
import {
  FaFileCsv,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";

import exportCSV from "../../utils/exportCSV";
import exportPDF from "../../utils/exportPDF";

export default function ExportButtons({ trucks }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type) => {
    if (!trucks || trucks.length === 0) return;

    setExporting(true);

    try {
      if (type === "csv") {
        exportCSV(trucks);
      } else if (type === "pdf") {
        exportPDF(trucks);
      }
    } finally {
      setTimeout(() => setExporting(false), 600);
    }
  };

  const disabled = !trucks || trucks.length === 0 || exporting;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => handleExport("csv")}
        disabled={disabled}
        title="Export truck data as CSV"
        style={{
          ...buttonStyle,
          background: "#10B981",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <FaFileCsv />
        {exporting ? " Exporting..." : " Export CSV"}
      </button>

      <button
        onClick={() => handleExport("pdf")}
        disabled={disabled}
        title="Export truck data as PDF"
        style={{
          ...buttonStyle,
          background: "#2563EB",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <FaFilePdf />
        {exporting ? " Exporting..." : " Export PDF"}
      </button>

      <button
        onClick={() => window.print()}
        disabled={disabled}
        title="Print analytics dashboard"
        style={{
          ...buttonStyle,
          background: "#6B7280",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <FaPrint />
        Print
      </button>
    </div>
  );
}

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  transition: "all 0.3s ease",
};