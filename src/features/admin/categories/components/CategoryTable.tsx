import { useState } from "react";

import {
  Chip,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import DeleteCategoryDialog from "./DeleteCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";

import { useCategories } from "../hooks/useCategories";

import type { Category } from "../types/category";

const PAGE_SIZE = 10;

export default function CategoryTable() {
  const { data: categories = [], isLoading } = useCategories();

  const [selected, setSelected] = useState<Category | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);

  // If the last category on a page is deleted, fall back to the previous page.
  const lastPage = Math.max(0, Math.ceil(categories.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);

  const visible = categories.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const openEdit = (category: Category) => {
    setSelected(category);
    setEditOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelected(category);
    setDeleteOpen(true);
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [0, 1, 2, 3].map((row) => (
                <TableRow key={row}>
                  {[0, 1, 2].map((cell) => (
                    <TableCell key={cell}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No categories yet. Use “Add category” to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visible.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={category.isActive ? "Active" : "Inactive"}
                      color={category.isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <IconButton
                      size="small"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => openEdit(category)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => openDelete(category)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {categories.length > PAGE_SIZE && (
        <TablePagination
          component="div"
          count={categories.length}
          page={currentPage}
          onPageChange={(_event, next) => setPage(next)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[]}
        />
      )}

      <EditCategoryDialog
        open={editOpen}
        category={selected}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        category={selected}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
      />
    </>
  );
}