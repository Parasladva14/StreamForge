import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trucks from "./pages/Trucks";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import FleetMapPage from "./pages/FleetMapPage";
import Geofences from "./pages/Geofences";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ==========================================
          Public Routes
      ========================================== */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* ==========================================
          Protected Routes
      ========================================== */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Truck Management */}
        <Route
          path="/trucks"
          element={<Trucks />}
        />

        {/* Fleet Live Map */}
        <Route
          path="/fleet-map"
          element={<FleetMapPage />}
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* Geofence Management */}
        <Route
          path="/geofences"
          element={<Geofences />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={<AdminPanel />}
        />

      </Route>

      {/* ==========================================
          Redirect Unknown Routes
      ========================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;