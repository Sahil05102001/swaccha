import { useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import AddressDialog from "@/features/profile/components/AddressDialog";
import AddressForm from "@/features/profile/components/AddressForm";
import CheckoutAddressList from "@/features/profile/components/CheckoutAddressList";
import {
  useAddAddress,
  useAddresses,
  useUpdateAddress,
} from "@/features/profile/hooks/useAddresses";
import { useProfile } from "@/features/profile/hooks/useProfile";
import type { Address } from "@/features/profile/types/address";
import { useSnackbar } from "@/contexts/SnackbarContext";

interface AddressSectionProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
}

type AddressValues = Omit<Address, "id" | "createdAt" | "updatedAt">;

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const pillSx = {
  px: 2,
  py: 0.6,
  borderRadius: 999,
  fontWeight: 600,
  fontSize: "0.85rem",
  textTransform: "none",
  color: COLORS.text,
  borderColor: COLORS.border,
  bgcolor: COLORS.white,
  transition: "none",
  "&:hover": { borderColor: COLORS.text, bgcolor: COLORS.white },
} as const;

export default function AddressSection({
  selectedAddressId,
  onSelectAddress,
}: AddressSectionProps) {
  const { showSnackbar } = useSnackbar();
  const { data: addresses = [], isLoading } = useAddresses();
  const { data: profile } = useProfile();

  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();

  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // Saves the customer typing their name and number again.
  const prefill: Partial<Address> = {
    fullName: profile?.name ?? "",
    phoneNumber: (profile as { phone?: string } | undefined)?.phone ?? "",
  };

  const handleAdd = (values: AddressValues) => {
    addAddress.mutate(values, {
      onSuccess: (newId) => {
        if (newId) onSelectAddress(newId);
        setDialog(null);
        showSnackbar("Address saved.", "success");
      },
      onError: (error) =>
        showSnackbar(
          error instanceof Error ? error.message : "Could not save address.",
          "error",
        ),
    });
  };

  const handleEdit = (values: AddressValues) => {
    if (!selectedAddress) return;

    updateAddress.mutate(
      { id: selectedAddress.id, address: values },
      {
        onSuccess: () => {
          setDialog(null);
          showSnackbar("Address updated.", "success");
        },
        onError: (error) =>
          showSnackbar(
            error instanceof Error
              ? error.message
              : "Could not update address.",
            "error",
          ),
      },
    );
  };

  return (
    <Box
      component="section"
      sx={{
        p: { xs: 2, sm: 3 },
        border: `1px solid ${COLORS.border}`,
        borderTop: `2px solid ${COLORS.blue}`,
        borderRadius: "12px",
        bgcolor: COLORS.white,
      }}
    >
      <Stack
        direction="row"
        sx={{
          mb: { xs: 2, sm: 2.5 },
          pb: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${COLORS.border}`,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.05rem", sm: "1.2rem" },
            letterSpacing: "-0.01em",
            color: COLORS.text,
          }}
        >
          Delivery address
        </Typography>

        {addresses.length > 0 && (
          <Stack direction="row" spacing={1}>
            {selectedAddress && (
              <Button
                variant="outlined"
                disableRipple
                startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={() => setDialog("edit")}
                sx={pillSx}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outlined"
              disableRipple
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => setDialog("add")}
              sx={pillSx}
            >
              Add new
            </Button>
          </Stack>
        )}
      </Stack>

      {isLoading ? (
        <Stack sx={{ alignItems: "center", py: 4 }}>
          <CircularProgress size={28} sx={{ color: COLORS.blue }} />
        </Stack>
      ) : addresses.length === 0 ? (
        <Stack spacing={2}>
          <Typography sx={{ fontSize: "0.9rem", color: COLORS.muted }}>
            Add where we should deliver your order. It is saved to your
            profile for next time.
          </Typography>

          <AddressForm
            key={`${profile?.name ?? ""}`}
            initialValues={prefill}
            loading={addAddress.isPending}
            onSubmit={handleAdd}
          />
        </Stack>
      ) : (
        <CheckoutAddressList
          selectedAddressId={selectedAddressId}
          onSelect={onSelectAddress}
        />
      )}

      <AddressDialog
        open={dialog !== null}
        title={dialog === "edit" ? "Edit address" : "Add new address"}
        loading={addAddress.isPending || updateAddress.isPending}
        initialValues={dialog === "edit" ? selectedAddress : prefill}
        onClose={() => setDialog(null)}
        onSubmit={dialog === "edit" ? handleEdit : handleAdd}
      />
    </Box>
  );
}
