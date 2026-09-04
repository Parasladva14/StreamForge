import "./ReportsToolbar.css";

import exportCSV from "../../utils/exportCSV";
import exportPDF from "../../utils/exportPDF";

export default function ReportsToolbar({ trucks }) {

    return (

        <div className="reports-toolbar">

            <div>

                <h2>Fleet Report</h2>

                <p>

                    {trucks.length} Records Found

                </p>

            </div>

            <div className="toolbar-buttons">

                <button
                    className="csv-btn"
                    onClick={() =>
                        exportCSV(trucks)
                    }
                >
                    📄 Export CSV
                </button>

                <button
                    className="pdf-btn"
                    onClick={() =>
                        exportPDF(trucks)
                    }
                >
                    📕 Export PDF
                </button>

            </div>

        </div>

    );

}