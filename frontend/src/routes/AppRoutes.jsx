import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Trucks from "../pages/Trucks";
import Analytics from "../pages/Analytics";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import FleetMapPage from "../pages/FleetMapPage";
import Geofences from "../pages/Geofences";
import Settings from "../pages/Settings";
import AdminPanel from "../pages/AdminPanel";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes inside MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route path="/fleet-map" element={<FleetMapPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/geofences" element={<Geofences />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Only Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}