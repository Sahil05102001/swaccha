import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useSnackbar } from "@/contexts/SnackbarContext";

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
  const { showSnackbar } = useSnackbar();
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteCategory.mutateAsync(category.id);
      showSnackbar("Category deleted.", "success");
      onClose();
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Could not delete the category.",
        "error",
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete category</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{category?.name}</strong>?
          Products in this category are not deleted.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleteCategory.isPending}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={deleteCategory.isPending}
        >
          {deleteCategory.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}