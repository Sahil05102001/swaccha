import { useRef, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useSnackbar } from "@/contexts/SnackbarContext";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import CategoryForm from "./CategoryForm";

import { useAddCategory } from "../hooks/useAddCategory";

import type { CategoryFormData } from "../types/category";

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCategoryCreated?: (categoryName: string) => void;
}

const initialFormData: CategoryFormData = {
  name: "",
  imageUrl: "",
  isActive: true,
};

export default function AddCategoryDialog({
  open,
  onClose,
  onCategoryCreated,
}: AddCategoryDialogProps) {
  const { showSnackbar } = useSnackbar();
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [error, setError] = useState("");

  const addCategory = useAddCategory();

  const handleChange = (
    field: keyof CategoryFormData,
    value: string | boolean,
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const handleClose = () => {
    if (addCategory.isPending) return;

    setFormData(initialFormData);
    setError("");
    onClose();
  };

  const fail = (message: string) => {
    setError(message);
    scrollToTop(contentRef.current);
  };

  const handleSave = async () => {
    const categoryName = formData.name.trim();

    if (!categoryName) {
      fail("Please enter a category name.");
      return;
    }

    try {
      await addCategory.mutateAsync({
        ...formData,
        name: categoryName,
        imageUrl: "",
      });

      onCategoryCreated?.(categoryName);
      showSnackbar("Category added.", "success");

      setFormData(initialFormData);
      setError("");
      onClose();
      scrollToTop();
    } catch (err) {
      console.error("Category creation failed:", err);

      fail(
        err instanceof Error
          ? err.message
          : "Unable to create category. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add category</DialogTitle>

      <DialogContent ref={contentRef}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <CategoryForm formData={formData} onChange={handleChange} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={addCategory.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={addCategory.isPending}
        >
          {addCategory.isPending ? "Saving..." : "Add category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}