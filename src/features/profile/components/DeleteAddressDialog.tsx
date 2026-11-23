import {
  Box,
  Button,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";

import { useDeleteAddress } from "../hooks/useAddresses";
import type { Address } from "../types/address";
import { useSnackbar } from "../../../contexts/SnackbarContext";

interface DeleteAddressDialogProps {
  open: boolean;
  address: Address | null;
  onClose: () => void;
}

const COLORS = {
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  red: "#DC2626",
  redDark: "#B91C1C",
};

export default function DeleteAddressDialog({
  open,
  address,
  onClose,
}: DeleteAddressDialogProps) {
  const deleteAddressMutation = useDeleteAddress();
  const { showSnackbar } = useSnackbar();

  const handleDelete = () => {
    if (!address) return;

    deleteAddressMutation.mutate(address.id, {
      onSuccess: () => {
        showSnackbar("Address deleted successfully.", "success");
        onClose();
      },
      onError: (error: Error) => {
        showSnackbar(error.message, "error");
      },
    });
  };

  const pending = deleteAddressMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (pending) return;
        if (reason === "backdropClick") return;
        onClose();
      }}
      fullWidth
      maxWidth="xs"
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            m: 2,
            p: { xs: 2.5, sm: 3 },
            borderRadius: "12px",
            boxShadow: "none",
            border: `1px solid ${COLORS.border}`,
            backgroundImage: "none",
          },
        },
      }}
    >
      <Typography
        component="h2"
        sx={{ fontWeight: 700, fontSize: "1.15rem", color: COLORS.text }}
      >
        Delete this address?
      </Typography>

      {address && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "8px",
            bgcolor: "#FAFAFA",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: COLORS.text }}>
            {address.fullName}
          </Typography>
          <Typography
            sx={{
              mt: 0.25,
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: COLORS.muted,
              overflowWrap: "anywhere",
            }}
          >
            {[address.addressLine1, address.addressLine2, address.city, address.postalCode]
              .filter(Boolean)
              .join(", ")}
          </Typography>
        </Box>
      )}

      <Typography sx={{ mt: 1.5, fontSize: "0.9rem", color: COLORS.muted }}>
        This action cannot be undone.
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <Button
          fullWidth
          disableRipple
          variant="outlined"
          onClick={onClose}
          disabled={pending}
          sx={{
            py: 1,
            borderRadius: 999,
            fontWeight: 600,
            textTransform: "none",
            color: COLORS.text,
            borderColor: COLORS.border,
            "&:hover": { borderColor: COLORS.text, bgcolor: COLORS.white },
          }}
        >
          Cancel
        </Button>

        <Button
          fullWidth
          disableRipple
          disableElevation
          variant="contained"
          onClick={handleDelete}
          disabled={pending}
          sx={{
            py: 1,
            borderRadius: 999,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: COLORS.red,
            color: COLORS.white,
            boxShadow: "none",
            "&:hover": { bgcolor: COLORS.redDark, boxShadow: "none" },
          }}
        >
          {pending ? "Deleting..." : "Delete"}
        </Button>
      </Stack>
    </Dialog>
  );
}