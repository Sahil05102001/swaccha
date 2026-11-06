import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";
import {
  logout,
  sendVerificationEmail,
  updateDisplayName,
} from "@/features/auth/services/authService";

import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useSetDefaultAddress,
} from "../hooks/useAddresses";

import ProfileInfoCard from "../components/ProfileInfoCard";
import AddressSection from "../components/AddressSection";
import AddressDialog from "../components/AddressDialog";
import DeleteAddressDialog from "../components/DeleteAddressDialog";

import type { Address } from "../types/address";

import { useSnackbar } from "@/contexts/SnackbarContext";

const COLORS = {
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  blue: "#00D9FF",
};

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState(user?.displayName ?? "");

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    null
  );

  const [deleteAddress, setDeleteAddress] = useState<Address | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const { data: addresses, isLoading } = useAddresses();

  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const setDefaultMutation = useSetDefaultAddress();

  // Keep the name field in sync once the user finishes loading.
  useEffect(() => {
    setName(user?.displayName ?? "");
  }, [user?.displayName]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Returns true/false so the resend timer in ProfileInfoCard
  // only starts when the email was actually sent.
  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      showSnackbar("Verification email sent.", "success");
      return true;
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to send verification email.",
        "error"
      );
      return false;
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateDisplayName(name);
      await refreshUser();

      showSnackbar("Profile updated successfully.", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to update profile.",
        "error"
      );
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshUser();

      showSnackbar("Verification status updated.", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to refresh verification status.",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      showSnackbar("You have been logged out.", "success");
      // AuthContext will update when Firebase signs the user out.
      // The existing !user condition will then redirect to /login.
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to log out. Please try again.",
        "error"
      );
      setLoggingOut(false);
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    if (setDefaultMutation.isPending) return;

    setDefaultMutation.mutate(id, {
      onSuccess: () => {
        showSnackbar("Default address updated.", "success");
      },
      onError: (error: Error) => {
        showSnackbar(error.message, "error");
      },
    });
  };

  return (
    <Box sx={{ bgcolor: COLORS.white }}>
      <Container
        maxWidth="md"
        sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 6 } }}
      >
        {/* Page header */}
        <Stack
          direction="row"
          sx={{
            mb: { xs: 2.5, sm: 4 },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.4rem", sm: "1.75rem" },
                letterSpacing: "-0.01em",
                color: COLORS.text,
              }}
            >
              My Profile
            </Typography>

            <Typography
              sx={{ mt: 0.5, fontSize: "0.9rem", color: COLORS.muted }}
            >
              Manage your personal details and saved addresses.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            disableRipple
            disabled={loggingOut}
            onClick={handleLogout}
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{
              flexShrink: 0,
              px: 2,
              py: 0.9,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              color: COLORS.text,
              borderColor: COLORS.border,
              bgcolor: COLORS.white,
              transition: "none",
              "&:hover": {
                borderColor: COLORS.text,
                bgcolor: COLORS.white,
              },
              "&:focus-visible": {
                outline: `2px solid ${COLORS.blue}`,
                outlineOffset: 2,
              },
              "&.Mui-disabled": {
                color: COLORS.muted,
                borderColor: COLORS.border,
              },
            }}
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </Button>
        </Stack>

        <Stack spacing={{ xs: 2, sm: 3 }}>
          <ProfileInfoCard
            user={user}
            name={name}
            setName={setName}
            onSaveProfile={handleSaveProfile}
            onVerifyEmail={handleVerifyEmail}
            onRefreshStatus={handleRefreshStatus}
          />

          <AddressSection
            addresses={addresses ?? []}
            isLoading={isLoading}
            onAddAddress={() => {
              setSelectedAddress(null);
              setAddressDialogOpen(true);
            }}
            onEditAddress={(address) => {
              setSelectedAddress(address);
              setAddressDialogOpen(true);
            }}
            onDeleteAddress={(address) => {
              setDeleteAddress(address);
              setDeleteDialogOpen(true);
            }}
            onSetDefaultAddress={handleSetDefaultAddress}
          />
        </Stack>

        <AddressDialog
          open={addressDialogOpen}
          title={selectedAddress ? "Edit Address" : "Add Address"}
          loading={
            addAddressMutation.isPending || updateAddressMutation.isPending
          }
          initialValues={selectedAddress ?? undefined}
          onClose={() => {
            setAddressDialogOpen(false);
            setSelectedAddress(null);
          }}
          onSubmit={(values) => {
            if (selectedAddress) {
              updateAddressMutation.mutate(
                {
                  id: selectedAddress.id,
                  address: values,
                },
                {
                  onSuccess: () => {
                    showSnackbar("Address updated successfully.", "success");
                    setAddressDialogOpen(false);
                    setSelectedAddress(null);
                  },
                  onError: (error: Error) => {
                    showSnackbar(error.message, "error");
                  },
                }
              );
            } else {
              addAddressMutation.mutate(values, {
                onSuccess: () => {
                  showSnackbar("Address added successfully.", "success");
                  setAddressDialogOpen(false);
                },
                onError: (error: Error) => {
                  showSnackbar(error.message, "error");
                },
              });
            }
          }}
        />

        <DeleteAddressDialog
          open={deleteDialogOpen}
          address={deleteAddress}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteAddress(null);
          }}
        />
      </Container>
    </Box>
  );
}