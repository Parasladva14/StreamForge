import { useState, useEffect } from "react";
import { updateTruck } from "../../services/truckService";
import { toast } from "react-toastify";

export default function EditTruckModal({
  truck,
  open,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    driver_name: "",
    location: "",
    temperature: "",
    status: "Active",
  });

  useEffect(() => {
    if (truck) {
      setForm({
        driver_name: truck.driver_name || "",
        location: truck.location || "",
        temperature: truck.temperature || "",
        status: truck.status || "Active",
      });
    }
  }, [truck]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !form.driver_name ||
      !form.location ||
      form.temperature === ""
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await updateTruck(truck.id, {
        driver_name: form.driver_name,
        location: form.location,
        temperature: Number(form.temperature),
        status: form.status,
      });

      toast.success("Truck updated successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Unable to update truck");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 20 }}>
          ✏️ Edit Truck
        </h2>

        <form onSubmit={handleUpdate}>

          <label>Truck ID</label>

          <input
            value={truck?.truck_id || ""}
            disabled
            style={inputStyle}
          />

          <label>Driver Name</label>

          <input
            name="driver_name"
            value={form.driver_name}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Location</label>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Temperature (°C)</label>

          <input
            type="number"
            step="0.1"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">
              Maintenance
            </option>
          </select>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 25,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={updateButton}
            >
              {loading
                ? "Updating..."
                : "Update Truck"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  width: 500,
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 25px rgba(0,0,0,.3)",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 5,
  marginBottom: 15,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const updateButton = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
};

const cancelButton = {
  background: "#6B7280",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
};