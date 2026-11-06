import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import AddressForm from "./AddressForm";

import type { Address } from "../types/address";

interface AddressDialogProps {
  open: boolean;
  title: string;
  loading?: boolean;
  initialValues?: Partial<Address>;
  onClose: () => void;
  onSubmit: (
    values: Omit<Address, "id" | "createdAt" | "updatedAt">
  ) => void;
}

const COLORS = {
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

export default function AddressDialog({
  open,
  title,
  loading = false,
  initialValues,
  onClose,
  onSubmit,
}: AddressDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : 3,
            boxShadow: "none",
            border: fullScreen ? "none" : `1px solid ${COLORS.border}`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: { xs: "1.05rem", sm: "1.2rem" },
          color: COLORS.text,
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: { xs: 2, sm: 3 },
        }}
      >
        {title}
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          disabled={loading}
          edge="end"
          size="small"
          sx={{ color: COLORS.muted }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: "20px !important", pb: 3 }}>
        <AddressForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}