import { useState } from "react";
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
}) {
  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Geofence name is required.");
      return;
    }

    if (
      form.latitude === "" ||
      form.longitude === ""
    ) {
      toast.error(
        "Latitude and longitude are required."
      );
      return;
    }

    if (
      form.latitude < -90 ||
      form.latitude > 90
    ) {
      toast.error(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    if (
      form.longitude < -180 ||
      form.longitude > 180
    ) {
      toast.error(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    if (
      form.radius === "" ||
      Number(form.radius) <= 0
    ) {
      toast.error(
        "Radius must be greater than 0."
      );
      return;
    }

    try {
      setSaving(true);

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

      await geofenceService.createGeofence(
        payload
      );

      toast.success(
        "Geofence created successfully."
      );

      setForm(initialForm);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(
        "Failed to create geofence:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        "Unable to create geofence.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  return (
    <div className="geofence-form-card">
      <div className="geofence-form-header">
        <div>
          <h2>➕ Create Geofence</h2>

          <p>
            Create a geographic monitoring zone
            for your fleet.
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
            Reset
          </button>

          <button
            type="submit"
            className="create-button"
            disabled={saving}
          >
            {saving
              ? "Creating..."
              : "Create Geofence"}
          </button>
        </div>
      </form>
    </div>
  );
}