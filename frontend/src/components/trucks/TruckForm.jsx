import { useEffect, useState } from "react";
import { addTruck, updateTruck } from "../../services/truckService";
import { toast } from "react-toastify";

export default function TruckForm({
  initialData = null,
  isEdit = false,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    truck_id: "",
    driver_name: "",
    location: "",
    temperature: "",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        truck_id: initialData.truck_id || "",
        driver_name: initialData.driver_name || "",
        location: initialData.location || "",
        temperature: initialData.temperature || "",
        status: initialData.status || "Active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!form.truck_id.trim()) {
      toast.error("Truck ID is required");
      return false;
    }

    if (!form.driver_name.trim()) {
      toast.error("Driver Name is required");
      return false;
    }

    if (!form.location.trim()) {
      toast.error("Location is required");
      return false;
    }

    if (form.temperature === "") {
      toast.error("Temperature is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        truck_id: form.truck_id,
        driver_name: form.driver_name,
        location: form.location,
        temperature: Number(form.temperature),
        status: form.status,
      };

      if (isEdit) {
        await updateTruck(initialData.id, payload);
        toast.success("Truck Updated Successfully");
      } else {
        await addTruck(payload);
        toast.success("Truck Added Successfully");
      }

      if (!isEdit) {
        setForm({
          truck_id: "",
          driver_name: "",
          location: "",
          temperature: "",
          status: "Active",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Unable to Update Truck" : "Unable to Add Truck");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#1F2937",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        {isEdit ? "Edit Truck" : "Add New Truck"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            name="truck_id"
            placeholder="Truck ID"
            value={form.truck_id}
            onChange={handleChange}
            disabled={isEdit}
          />

          <input
            name="driver_name"
            placeholder="Driver Name"
            value={form.driver_name}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="number"
            name="temperature"
            placeholder="Temperature"
            value={form.temperature}
            onChange={handleChange}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "25px",
            padding: "12px 30px",
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading
            ? "Please Wait..."
            : isEdit
            ? "Update Truck"
            : "Add Truck"}
        </button>
      </form>
    </div>
  );
}