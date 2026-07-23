import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";

import ProductForm from "./ProductForm";

import type { ProductFormData } from "../types/product";

import { useAddProduct } from "../hooks/useAddProduct";
import { productSchema } from "../validations/productSchema";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  images: [],
  isActive: true,
};

type ProductErrors = Partial<
  Record<keyof ProductFormData, string>
>;

export default function AddProductDialog({
  open,
  onClose,
}: AddProductDialogProps) {
  const [formData, setFormData] =
    useState<ProductFormData>(initialFormData);

  const [errors, setErrors] =
    useState<ProductErrors>({});

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const addProductMutation = useAddProduct();

  const handleChange = (
    field: keyof ProductFormData,
    value:
      | string
      | number
      | boolean
      | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: ProductErrors = {};

      result.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof ProductFormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setErrors({});

      await addProductMutation.mutateAsync(formData);

      setSuccessOpen(true);

      handleClose();
    } catch (error) {
      console.error(error);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent dividers>
          <ProductForm
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={addProductMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={addProductMutation.isPending}
          >
            {addProductMutation.isPending
              ? "Saving..."
              : "Save Product"}
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
          Product added successfully!
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
          Failed to add product.
        </Alert>
      </Snackbar>
    </>
  );
}