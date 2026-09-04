import { useEffect, useMemo, useState, useCallback } from "react";

import { getTrucks } from "../services/truckService";
import { analyticsService } from "../services/analyticsService";

import TemperatureLineChart from "../components/analytics/TemperatureLineChart";
import TemperatureBarChart from "../components/analytics/TemperatureBarChart";
import TemperaturePieChart from "../components/analytics/TemperaturePieChart";
import LocationChart from "../components/analytics/LocationChart";

import AnalyticsFilter from "../components/analytics/AnalyticsFilter";
import ExportButtons from "../components/analytics/ExportButtons";
import SummaryCards from "../components/analytics/SummaryCards";
import AlertBanner from "../components/analytics/AlertBanner";
import LastUpdated from "../components/analytics/LastUpdated";

import useWebSocket from "../hooks/useWebSocket";

export default function Analytics() {

    const [trucks, setTrucks] = useState([]);
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(null);

    const [selectedLocation, setSelectedLocation] = useState("");

    const loadData = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const [truckData, summaryData] = await Promise.all([
                getTrucks(),
                analyticsService.getDashboardSummary(),
            ]);

            setTrucks(truckData);
            setSummary(summaryData);

            setLastUpdated(new Date());

        } catch (err) {

            console.error(err);
            setError("Unable to load analytics data.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadData();

        const timer = setInterval(loadData, 10000);

        return () => clearInterval(timer);

    }, [loadData]);

    useWebSocket((message) => {

        if (
            message.event === "truck_created" ||
            message.event === "truck_updated" ||
            message.event === "truck_deleted"
        ) {
            loadData();
        }

    });

    const locations = useMemo(() => {

        return [...new Set(trucks.map((t) => t.location))];

    }, [trucks]);

    const filteredTrucks = useMemo(() => {

        if (!selectedLocation) return trucks;

        return trucks.filter(
            (t) => t.location === selectedLocation
        );

    }, [selectedLocation, trucks]);

    if (loading) {

        return (
            <div
                style={{
                    background: "#111827",
                    color: "white",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    fontSize: 22,
                    gap: 15,
                }}
            >
                <div
                    style={{
                        width: 45,
                        height: 45,
                        border: "5px solid #374151",
                        borderTop: "5px solid #3B82F6",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />

                Loading Analytics...
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

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: 25,
                    gap: 15,
                }}
            >

                <div>

                    <h1
                        style={{
                            color: "white",
                            marginBottom: 8,
                        }}
                    >
                        📊 Fleet Analytics Dashboard
                    </h1>

                    <LastUpdated lastUpdated={lastUpdated} />

                </div>

                <button
                    onClick={loadData}
                    style={{
                        background: "#2563EB",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🔄 Refresh
                </button>

            </div>

            {error && (

                <div
                    style={{
                        background: "#991B1B",
                        color: "white",
                        padding: 15,
                        borderRadius: 10,
                        marginBottom: 20,
                    }}
                >
                    {error}
                </div>

            )}

            <AlertBanner trucks={filteredTrucks} />

            <SummaryCards summary={summary} />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20,
                    marginTop: 30,
                    marginBottom: 30,
                }}
            >

                <AnalyticsFilter
                    locations={locations}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />

                <ExportButtons
                    trucks={filteredTrucks}
                />

            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(450px,1fr))",
                    gap: 25,
                }}
            >

                <TemperatureLineChart
                    trucks={filteredTrucks}
                />

                <TemperatureBarChart
                    trucks={filteredTrucks}
                />

                <TemperaturePieChart
                    trucks={filteredTrucks}
                />

                <LocationChart
                    trucks={filteredTrucks}
                />

            </div>

        </div>

    );

}