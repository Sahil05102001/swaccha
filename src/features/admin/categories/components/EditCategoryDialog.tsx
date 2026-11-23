import { useEffect, useRef, useState } from "react";

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

import { useUpdateCategory } from "../hooks/useUpdateCategory";

import type { Category, CategoryFormData } from "../types/category";

interface EditCategoryDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

const initialFormData: CategoryFormData = {
  name: "",
  imageUrl: "",
  isActive: true,
};

export default function EditCategoryDialog({
  open,
  category,
  onClose,
}: EditCategoryDialogProps) {
  const { showSnackbar } = useSnackbar();
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [error, setError] = useState("");

  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
      });
      setError("");
    }
  }, [category]);

  const handleChange = (
    field: keyof CategoryFormData,
    value: string | boolean,
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const handleSave = async () => {
    if (!category) return;

    if (!formData.name.trim()) {
      setError("Please enter a category name.");
      scrollToTop(contentRef.current);
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: category.id,
        category: { ...formData, name: formData.name.trim() },
      });

      showSnackbar("Category updated.", "success");
      onClose();
      scrollToTop();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update category. Please try again.",
      );
      scrollToTop(contentRef.current);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit category</DialogTitle>

      <DialogContent ref={contentRef}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <CategoryForm formData={formData} onChange={handleChange} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={updateCategory.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateCategory.isPending}
        >
          {updateCategory.isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}