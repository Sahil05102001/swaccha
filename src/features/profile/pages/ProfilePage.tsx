import { Container } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/features/auth/AuthContext";
import {
  sendVerificationEmail,
  updateDisplayName,
} from "@/features/auth/services/authService";

import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
} from "../hooks/useAddresses";

import ProfileInfoCard from "../components/ProfileInfoCard";
import AddressSection from "../components/AddressSection";
import AddressDialog from "../components/AddressDialog";
import DeleteAddressDialog from "../components/DeleteAddressDialog";

import type { Address } from "../types/address";

import { useSnackbar } from "@/contexts/SnackbarContext";

export default function ProfilePage() {
  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState(
    user?.displayName ?? ""
  );

  const [addressDialogOpen, setAddressDialogOpen] =
    useState(false);

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [deleteAddress, setDeleteAddress] =
    useState<Address | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const {
    data: addresses,
    isLoading,
  } = useAddresses();

  const addAddressMutation = useAddAddress();
  const updateAddressMutation =
    useUpdateAddress();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      showSnackbar(
        "Verification email sent.",
        "success"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateDisplayName(name);
      await refreshUser();

      showSnackbar(
        "Profile updated successfully.",
        "success"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshUser();

      showSnackbar(
        "Verification status updated.",
        "success"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ py: 5 }}
    >
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
      />

      <AddressDialog
        open={addressDialogOpen}
        title={
          selectedAddress
            ? "Edit Address"
            : "Add Address"
        }
        loading={
          addAddressMutation.isPending ||
          updateAddressMutation.isPending
        }
        initialValues={
          selectedAddress ?? undefined
        }
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
                  showSnackbar(
                    "Address updated successfully.",
                    "success"
                  );

                  setAddressDialogOpen(false);
                  setSelectedAddress(null);
                },
                onError: (error: any) => {
                  showSnackbar(
                    error.message,
                    "error"
                  );
                },
              }
            );
          } else {
            addAddressMutation.mutate(values, {
              onSuccess: () => {
                showSnackbar(
                  "Address added successfully.",
                  "success"
                );

                setAddressDialogOpen(false);
              },
              onError: (error: any) => {
                showSnackbar(
                  error.message,
                  "error"
                );
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
  );
}