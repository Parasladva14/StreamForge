import {
  useCallback,
  useEffect,
  useState,
} from "react";

import geofenceService from "../services/geofenceService";

import GeofenceForm from "../components/geofence/GeofenceForm";

export default function Geofences() {
  const [geofences, setGeofences] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadGeofences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await geofenceService.getGeofences();

      setGeofences(data || []);
    } catch (error) {
      console.error(
        "Failed to load geofences:",
        error
      );

      setError(
        "Unable to load geofences."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGeofences();
  }, [loadGeofences]);

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* Page Header */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "8px",
          }}
        >
          🌍 Geofence Management
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            margin: 0,
          }}
        >
          Create and manage geographic
          monitoring zones for your fleet.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#991B1B",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Create Form */}

      <GeofenceForm
        onSuccess={loadGeofences}
      />

      {/* Existing Geofences */}

      <div
        style={{
          background: "#1F2937",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "white",
              margin: 0,
            }}
          >
            📍 Existing Geofences
          </h2>

          <button
            onClick={loadGeofences}
            style={{
              background: "#374151",
              color: "white",
              border: "none",
              padding: "9px 15px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div
            style={{
              color: "#D1D5DB",
              textAlign: "center",
              padding: "30px",
            }}
          >
            Loading Geofences...
          </div>
        ) : geofences.length === 0 ? (
          <div
            style={{
              color: "#9CA3AF",
              textAlign: "center",
              padding: "30px",
            }}
          >
            📍 No geofences created yet.
          </div>
        ) : (
          <div>
            {geofences.map((geofence) => (
              <div
                key={geofence.id}
                style={{
                  background: "#374151",
                  borderRadius: "10px",
                  padding: "18px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: "white",
                        margin:
                          "0 0 8px",
                      }}
                    >
                      📍 {geofence.name}
                    </h3>

                    <p
                      style={{
                        color: "#9CA3AF",
                        margin:
                          "0 0 10px",
                      }}
                    >
                      {geofence.description ||
                        "No description"}
                    </p>
                  </div>

                  <span
                    style={{
                      background:
                        geofence.active
                          ? "#065F46"
                          : "#7F1D1D",

                      color:
                        geofence.active
                          ? "#6EE7B7"
                          : "#FCA5A5",

                      padding:
                        "5px 10px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "12px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {geofence.active
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(180px,1fr))",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      color: "#D1D5DB",
                    }}
                  >
                    <strong>
                      Type:
                    </strong>{" "}
                    {geofence.type}
                  </div>

                  <div
                    style={{
                      color: "#D1D5DB",
                    }}
                  >
                    <strong>
                      Latitude:
                    </strong>{" "}
                    {geofence.latitude}
                  </div>

                  <div
                    style={{
                      color: "#D1D5DB",
                    }}
                  >
                    <strong>
                      Longitude:
                    </strong>{" "}
                    {geofence.longitude}
                  </div>

                  <div
                    style={{
                      color: "#D1D5DB",
                    }}
                  >
                    <strong>
                      Radius:
                    </strong>{" "}
                    {geofence.radius} m
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}