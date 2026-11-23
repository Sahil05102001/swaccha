
import { useEffect, useRef, useState } from "react";

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
import { productSchema } from "../validations/productSchema";
import { deleteCloudinaryProductImage } from "../services/productImageService";
import { DuplicateProductError } from "@/features/admin/products/services/productService";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

interface EditProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  brand: "",
  sku: "",
  category: "",
  subcategory: "",
  productSize: "",
  unit: "",
  price: 0,
  mrp: 0,
  stock: 0,
  images: [],
  isActive: true,
  hsnCode: "",
  gstRate: "",
  badgeMode: "none",
  badgeText: "",
};

type ProductErrors = Partial<
  Record<keyof ProductFormData, string>
>;

export default function EditProductDialog({
  open,
  product,
  onClose,
}: EditProductDialogProps) {
  const [formData, setFormData] =
    useState<ProductFormData>(initialFormData);

  const [errors, setErrors] =
    useState<ProductErrors>({});

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const [uploading, setUploading] = useState(false);

  // Tracks only the newly uploaded, unsaved image.
  const temporaryImagePublicId = useRef<string | null>(null);

  const updateProductMutation = useUpdateProduct();

  const contentRef = useRef<HTMLDivElement>(null);

  // Scrolls the dialog to the first field that has an error.
  const showFirstError = () => {
    window.setTimeout(() => {
      contentRef.current
        ?.querySelector(".Mui-error")
        ?.scrollIntoView({ block: "center" });
    }, 0);
  };

  useEffect(() => {
    temporaryImagePublicId.current = null;

    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        brand: product.brand ?? "",
        sku: product.sku ?? "",
        subcategory: product.subcategory ?? "",
        productSize: product.productSize ?? "",
        unit: product.unit ?? "",
        category: product.category,
        price: product.price,
        mrp: product.mrp ?? product.price ?? 0,
        stock: product.stock,
        images: product.images ?? [],
        imagePublicId: product.imagePublicId ?? "",
        isActive: product.isActive,
        hsnCode: product.hsnCode ?? "",
        gstRate: product.gstRate ?? "",
        badgeMode: product.badgeMode ?? "none",
        badgeText: product.badgeText ?? "",
      });

      setErrors({});
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [product]);

  const handleChange = (
    field: keyof ProductFormData,
    value:
      | string
      | number
      | boolean
      | string[]
  ) => {
    if (field === "imagePublicId") {
      const newPublicId =
        typeof value === "string" ? value.trim() : "";

      const previousPublicId = temporaryImagePublicId.current;

      if (
        previousPublicId &&
        previousPublicId !== newPublicId
      ) {
        void deleteCloudinaryProductImage(previousPublicId).catch(
          (error) => {
            console.error(
              "Previous temporary product image cleanup failed:",
              error,
            );
          },
        );
      }

      temporaryImagePublicId.current =
        newPublicId || null;
    }

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

  const handleClose = async () => {
    if (uploading || updateProductMutation.isPending) {
      return;
    }

    const temporaryPublicId =
      temporaryImagePublicId.current;

    temporaryImagePublicId.current = null;

    setFormData(initialFormData);
    setErrors({});

    if (temporaryPublicId) {
      try {
        await deleteCloudinaryProductImage(
          temporaryPublicId,
        );
      } catch (error) {
        console.error(
          "Temporary product image cleanup failed:",
          error,
        );
      }
    }

    onClose();
  };

  const handleSave = async () => {
    if (!product || uploading) return;

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
      showFirstError();
      return;
    }

    try {
      setErrors({});
      setErrorOpen(false);

      const oldPublicId =
        product.imagePublicId?.trim() ?? "";

      const newPublicId =
        formData.imagePublicId?.trim() ?? "";

      await updateProductMutation.mutateAsync({
        id: product.id,
        product: formData,
      });

      // The new image is now referenced by the saved product.
      temporaryImagePublicId.current = null;

      // Only attempt to delete the previous image after
      // the product update has succeeded.
      if (
        oldPublicId &&
        oldPublicId !== newPublicId
      ) {
        try {
          await deleteCloudinaryProductImage(oldPublicId);
        } catch (cleanupError) {
          console.error(
            "Previous product image cleanup failed:",
            cleanupError,
          );
        }
      }

      setSuccessOpen(true);

      setFormData(initialFormData);
      setErrors({});

      onClose();
      scrollToTop();
    } catch (error: unknown) {
      if (error instanceof DuplicateProductError) {
        setErrors((prev) => ({
          ...prev,
          [error.field]: error.message,
        }));
        showFirstError();
      } else {
        console.error(error);
        setErrorOpen(true);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          void handleClose();
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent dividers ref={contentRef}>
          <ProductForm
            formData={formData}
            onChange={handleChange}
            errors={errors}
            stockLocked
            onUploadingChange={setUploading}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              void handleClose();
            }}
            disabled={
              uploading || updateProductMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              uploading || updateProductMutation.isPending
            }
          >
            {uploading
              ? "Uploading image..."
              : updateProductMutation.isPending
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
