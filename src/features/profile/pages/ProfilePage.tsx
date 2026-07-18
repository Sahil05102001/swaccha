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
  TextField,
} from "@mui/material";

import { Navigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/features/auth/AuthContext";
import {
  sendVerificationEmail,
  updateDisplayName,
} from "@/features/auth/services/authService";

import AddressForm from "../components/AddressForm";
import {
  useAddAddress,
  useAddresses,
} from "../hooks/useAddresses";

export default function ProfilePage() {
  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  const [name, setName] = useState(user?.displayName ?? "");

  const {
    data: addresses,
    isLoading,
    error,
  } = useAddresses();

  const addAddressMutation = useAddAddress();

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

  const handleSaveProfile = async () => {
    try {
      await updateDisplayName(name);

      await refreshUser();

      alert("Profile updated successfully.");
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

  console.log(addresses);
  console.log(isLoading);
  console.log(error);

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
                sx={{ mb: 1 }}
              >
                Full Name
              </Typography>

              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
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

      <Box sx={{ mt: 4 }}>
        <AddressForm
          onSubmit={(data) => {
            addAddressMutation.mutate(data, {
              onSuccess: () => {
                alert("Address added successfully.");
              },
              onError: (error: any) => {
                alert(error.message);
              },
            });
          }}
        />
      </Box>

      <Button
        variant="contained"
        disabled={addAddressMutation.isPending}
        sx={{ mt: 2 }}
      >
        {addAddressMutation.isPending
          ? "Saving..."
          : "Ready"}
      </Button>
    </Container>
  );
}