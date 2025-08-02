import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home1";
import NotFound from "../pages/Extra/NotFound";
import Login from "../pages/RegisterLogin/Login";
import Dashboard from "../pages/Dashboard";
import Verification from "../pages/RegisterLogin/Verification";
import ProtectedRoute from "./ProtectedRoute";
import GlobalToast from "../components/GlobalAlert/GlobalToast";
import PublicRoute from "./PublicRoute";
import ForgotPassword from "../pages/Password/ForgotPassword";
import ResetPassword from "../pages/Password/ResetPassword";
import CityFix from "../pages/CityFix/CityFix";

export default function AppRoutes() {
  return (
    <>
      <GlobalToast />
      <Routes>
        {/* Public Home */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Public route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/verify_user"
          element={
            <PublicRoute>
              <Verification />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-issues"
          element={
            <ProtectedRoute>
              <CityFix />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
