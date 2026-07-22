import { useState } from "react";

import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import { useCategories } from "../hooks/useCategories";

import type { Category } from "../types/category";

export default function CategoryTable() {
  const {
    data: categories = [],
    isLoading,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const handleEdit = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  <Typography color="text.secondary">
                    No categories found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  hover
                  key={category.id}
                >
                  <TableCell>
                    <Avatar
                      src={category.imageUrl}
                      variant="rounded"
                    >
                      {category.name.charAt(0)}
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    {category.name}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        category.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        category.isActive
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEdit(category)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDelete(category)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditCategoryDialog
        open={editOpen}
        category={selectedCategory}
        onClose={handleCloseEdit}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        category={selectedCategory}
        onClose={handleCloseDelete}
      />
    </>
  );
}