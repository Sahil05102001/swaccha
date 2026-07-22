import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useDeleteCategory } from "../hooks/useDeleteCategory";

import type { Category } from "../types/category";

interface DeleteCategoryDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

export default function DeleteCategoryDialog({
  open,
  category,
  onClose,
}: DeleteCategoryDialogProps) {
  const deleteCategory =
    useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;

    await deleteCategory.mutateAsync(
      category.id
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Category
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{category?.name}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={deleteCategory.isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}