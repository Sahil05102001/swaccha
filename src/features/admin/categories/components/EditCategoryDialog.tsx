import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import CategoryForm from "./CategoryForm";

import { useUpdateCategory } from "../hooks/useUpdateCategory";

import type {
  Category,
  CategoryFormData,
} from "../types/category";

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
  const [formData, setFormData] =
    useState<CategoryFormData>(initialFormData);

  const updateCategory =
    useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
      });
    }
  }, [category]);

  const handleChange = (
    field: keyof CategoryFormData,
    value: string | boolean
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!category) return;

    await updateCategory.mutateAsync({
      id: category.id,
      category: formData,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Edit Category
      </DialogTitle>

      <DialogContent>
        <CategoryForm
          formData={formData}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateCategory.isPending}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}