import { useEffect, useState } from "react";

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

import type {
  Product,
  ProductFormData,
} from "../types/product";

import { useUpdateProduct } from "../hooks/useUpdateProduct";

interface EditProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  isActive: true,
};

export default function EditProductDialog({
  open,
  product,
  onClose,
}: EditProductDialogProps) {
  const [formData, setFormData] =
    useState<ProductFormData>(initialFormData);

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.images[0] ?? "",
        isActive: product.isActive,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [product]);

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleSave = async () => {
    if (!product) return;

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        product: formData,
      });

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
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent dividers>
          <ProductForm
            formData={formData}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={updateProductMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updateProductMutation.isPending}
          >
            {updateProductMutation.isPending
              ? "Updating..."
              : "Update Product"}
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
          Product updated successfully!
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
          Failed to update product.
        </Alert>
      </Snackbar>
    </>
  );
}