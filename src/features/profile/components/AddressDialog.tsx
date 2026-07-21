import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AddressForm from "./AddressForm";

import type { Address } from "../types/address";

interface AddressDialogProps {
  open: boolean;
  title: string;
  loading?: boolean;
  initialValues?: Partial<Address>;
  onClose: () => void;
  onSubmit: (
    values: Omit<
      Address,
      "id" | "createdAt" | "updatedAt"
    >
  ) => void;
}

export default function AddressDialog({
  open,
  title,
  loading = false,
  initialValues,
  onClose,
  onSubmit,
}: AddressDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <AddressForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}