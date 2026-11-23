import { Link, Outlet, useLocation } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import { useAuth } from "@/features/auth/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useMaintenance } from "../hooks/useMaintenance";
import MaintenanceView from "./MaintenanceView";
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

function GateLoading() {
  return (
    <Box role="status" aria-label="Loading" sx={{ minHeight: "100vh" }}>
      <LinearProgress />
    </Box>
  );
}

function AdminBanner() {
  return (
    <Box
      role="status"
      sx={{
        bgcolor: "#B91C1C",
        color: "#fff",
        px: 2,
        py: 1,
        fontSize: "0.85rem",
        textAlign: "center",
      }}
    >
      Maintenance mode is ON. Customers cannot see the store. You can, because
      you are logged in as admin.{" "}
      <Box
        component={Link}
        to="/admin/maintenance"
        sx={{ color: "#fff", fontWeight: 700 }}
      >
        Manage
      </Box>
    </Box>
  );
}

/**
 * Wraps every customer page. While maintenance mode is ON, customers only
 * ever see the maintenance page. Admins see the store with a red banner.
 */
export default function MaintenanceGate() {
  const { pathname } = useLocation();
  const { data: settings, isLoading, isError, refetch, isFetching } =
    useMaintenance();
  const { loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (isLoading) return <GateLoading />;

  // If the setting can't be read, keep the store open.
  if (isError || !settings?.enabled) return <Outlet />;

  if (authLoading || profileLoading) return <GateLoading />;

  if (profile?.role === "admin") {
    return (
      <>
        <AdminBanner />
        <Outlet />
      </>
    );
  }

  // So an admin can still sign in while the store is closed.
  if (pathname === "/login") {
    return (
      <Suspense fallback={<GateLoading />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <MaintenanceView
      settings={settings}
      onRetry={() => void refetch()}
      retrying={isFetching}
    />
  );
}