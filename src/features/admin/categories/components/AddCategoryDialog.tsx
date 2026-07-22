import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import CategoryForm from "./CategoryForm";

import { useAddCategory } from "../hooks/useAddCategory";

import type { CategoryFormData } from "../types/category";

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialFormData: CategoryFormData = {
  name: "",
  imageUrl: "",
  isActive: true,
};

export default function AddCategoryDialog({
  open,
  onClose,
}: AddCategoryDialogProps) {
  const [formData, setFormData] =
    useState<CategoryFormData>(initialFormData);

  const addCategory = useAddCategory();

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
    await addCategory.mutateAsync(formData);

    setFormData(initialFormData);

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
        Add Category
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
          disabled={addCategory.isPending}
        >
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
}