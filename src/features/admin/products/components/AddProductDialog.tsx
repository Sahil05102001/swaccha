
import { useRef, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { recordInitialStockRequest } from "@/features/stock/services/stockService";
import { deleteCloudinaryProductImage } from "../services/productImageService";
import { DuplicateProductError } from "@/features/admin/products/services/productService";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

interface AddProductDialogProps {
  open: boolean;
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

type ProductErrors = Partial<Record<keyof ProductFormData, string>>;

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

  const [uploading, setUploading] = useState(false);

  const temporaryImagePublicId = useRef<string | null>(null);

  const addProductMutation = useAddProduct();

  const queryClient = useQueryClient();

  const contentRef = useRef<HTMLDivElement>(null);

  // Scrolls the dialog to the first field that has an error.
  const showFirstError = () => {
    window.setTimeout(() => {
      contentRef.current
        ?.querySelector(".Mui-error")
        ?.scrollIntoView({ block: "center" });
    }, 0);
  };

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

      temporaryImagePublicId.current = newPublicId || null;
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
    if (uploading || addProductMutation.isPending) {
      return;
    }

    const publicId = temporaryImagePublicId.current;

    // Clear tracking before cleanup so the image cannot be
    // accidentally deleted again by another close action.
    temporaryImagePublicId.current = null;

    setFormData(initialFormData);
    setErrors({});

    if (publicId) {
      try {
        await deleteCloudinaryProductImage(publicId);
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
    if (uploading) return;

    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: ProductErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormData;

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

      const created: unknown =
        await addProductMutation.mutateAsync(formData);

      // The product now references the uploaded image.
      // Do not delete it when the dialog closes.
      temporaryImagePublicId.current = null;

      // Record opening stock separately, preserving the existing flow.
      if (typeof created === "string" && formData.stock > 0) {
        try {
          await recordInitialStockRequest(created);

          queryClient.invalidateQueries({
            queryKey: ["stock-movements"],
          });

          queryClient.invalidateQueries({
            queryKey: ["stock-summary"],
          });
        } catch (error) {
          console.error("Opening stock was not recorded:", error);
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
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent dividers ref={contentRef}>
          <ProductForm
            formData={formData}
            onChange={handleChange}
            errors={errors}
            onUploadingChange={setUploading}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              void handleClose();
            }}
            disabled={
              uploading || addProductMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              uploading || addProductMutation.isPending
            }
          >
            {uploading
              ? "Uploading image..."
              : addProductMutation.isPending
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
