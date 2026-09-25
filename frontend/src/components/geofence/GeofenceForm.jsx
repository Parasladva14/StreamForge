import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import geofenceService from "../../services/geofenceService";

import "./GeofenceForm.css";

const initialForm = {
  name: "",
  description: "",
  type: "circle",
  latitude: "",
  longitude: "",
  radius: "",
  active: true,
};

export default function GeofenceForm({
  onSuccess,
  editingGeofence,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  const isEditing = !!editingGeofence;

  // Populate form when editing
  useEffect(() => {
    if (editingGeofence) {
      setForm({
        name: editingGeofence.name || "",
        description: editingGeofence.description || "",
        type: editingGeofence.type || "circle",
        latitude: editingGeofence.latitude ?? "",
        longitude: editingGeofence.longitude ?? "",
        radius: editingGeofence.radius ?? "",
        active: editingGeofence.active ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [editingGeofence]);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Geofence name is required.");
      return false;
    }

    if (
      form.latitude === "" ||
      form.longitude === ""
    ) {
      toast.error(
        "Latitude and longitude are required."
      );
      return false;
    }

    if (
      form.latitude < -90 ||
      form.latitude > 90
    ) {
      toast.error(
        "Latitude must be between -90 and 90."
      );
      return false;
    }

    if (
      form.longitude < -180 ||
      form.longitude > 180
    ) {
      toast.error(
        "Longitude must be between -180 and 180."
      );
      return false;
    }

    if (
      form.radius === "" ||
      Number(form.radius) <= 0
    ) {
      toast.error(
        "Radius must be greater than 0."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description:
        form.description.trim() || null,
      type: form.type,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radius: Number(form.radius),
      active: form.active,
    };

    try {
      setSaving(true);

      if (isEditing) {
        await geofenceService.updateGeofence(
          editingGeofence.id,
          payload
        );
        toast.success(
          "Geofence updated successfully."
        );
      } else {
        await geofenceService.createGeofence(
          payload
        );
        toast.success(
          "Geofence created successfully."
        );
      }

      setForm(initialForm);

      if (onCancelEdit) onCancelEdit();

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} geofence:`,
        error
      );

      const message =
        error?.response?.data?.detail ||
        `Unable to ${isEditing ? "update" : "create"} geofence.`;

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="geofence-form-card">
      <div className="geofence-form-header">
        <div>
          <h2>{isEditing ? "✏️ Edit Geofence" : "➕ Create Geofence"}</h2>

          <p>
            {isEditing
              ? `Editing "${editingGeofence.name}"`
              : "Create a geographic monitoring zone for your fleet."}
          </p>
        </div>
      </div>

      <form
        className="geofence-form"
        onSubmit={handleSubmit}
      >
        {/* Name */}

        <div className="form-group">
          <label htmlFor="name">
            Geofence Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Mumbai Warehouse"
            maxLength={100}
            disabled={saving}
          />
        </div>

        {/* Description */}

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe this monitoring zone"
            maxLength={255}
            rows={3}
            disabled={saving}
          />
        </div>

        {/* Type */}

        <div className="form-group">
          <label htmlFor="type">
            Geofence Type
          </label>

          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="circle">
              Circle
            </option>

            <option value="polygon" disabled>
              Polygon (Coming Soon)
            </option>
          </select>
        </div>

        {/* Coordinates */}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">
              Latitude
            </label>

            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              placeholder="19.0760"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">
              Longitude
            </label>

            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              placeholder="72.8777"
              disabled={saving}
            />
          </div>
        </div>

        {/* Radius */}

        <div className="form-group">
          <label htmlFor="radius">
            Radius (meters)
          </label>

          <input
            id="radius"
            name="radius"
            type="number"
            min="1"
            step="1"
            value={form.radius}
            onChange={handleChange}
            placeholder="1000"
            disabled={saving}
          />
        </div>

        {/* Active */}

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            disabled={saving}
          />

          <span>
            Geofence is active
          </span>
        </label>

        {/* Buttons */}

        <div className="form-actions">
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            disabled={saving}
          >
            {isEditing ? "Cancel" : "Reset"}
          </button>

          <button
            type="submit"
            className="create-button"
            disabled={saving}
          >
            {saving
              ? (isEditing ? "Updating..." : "Creating...")
              : (isEditing ? "Update Geofence" : "Create Geofence")}
          </button>
        </div>
      </form>
    </div>
  );
}