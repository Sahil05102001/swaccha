import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

import { useDeleteProduct } from "../hooks/useDeleteProduct";

interface DeleteProductDialogProps {
  open: boolean;
  productId: string | null;
  productName: string;
  onClose: () => void;
}

export default function DeleteProductDialog({
  open,
  productId,
  productName,
  onClose,
}: DeleteProductDialogProps) {
  const deleteMutation = useDeleteProduct();

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const handleDelete = async () => {
    if (!productId) return;

    try {
      await deleteMutation.mutateAsync(productId);

      setSuccessOpen(true);

      onClose();
    } catch (error) {
      console.error(error);

      setErrorOpen(true);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete Product
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            <strong> "{productName}" </strong>?
            <br />
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessOpen(false)}
        >
          Product deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert
          severity="error"
          onClose={() => setErrorOpen(false)}
        >
          Failed to delete product.
        </Alert>
      </Snackbar>
    </>
  );
}