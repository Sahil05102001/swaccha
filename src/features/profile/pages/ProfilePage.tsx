import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";
import { sendVerificationEmail } from "@/features/auth/services/authService";

export default function ProfilePage() {
  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      alert("Verification email sent. Please check your inbox.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshUser();
      alert("Verification status updated.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 28,
                }}
              >
                {user.displayName?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  My Profile
                </Typography>

                <Typography color="text.secondary">
                  Welcome back!
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Full Name
              </Typography>

              <Typography variant="h6">
                {user.displayName || "Not Set"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography variant="h6">
                {user.email}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Email Verification
              </Typography>

              <Chip
                label={
                  user.emailVerified
                    ? "Verified"
                    : "Not Verified"
                }
                color={
                  user.emailVerified
                    ? "success"
                    : "warning"
                }
              />

              {!user.emailVerified && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleVerifyEmail}
                  >
                    Send Verification Email
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleRefreshStatus}
                  >
                    Refresh Status
                  </Button>
                </Stack>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                User ID
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                }}
              >
                {user.uid}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}