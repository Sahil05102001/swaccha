import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  Box,
  CircularProgress,
} from "@mui/material";

import { useAuth } from "../AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";

export default function AdminProtectedRoute() {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const location = useLocation();

  if (loading || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}