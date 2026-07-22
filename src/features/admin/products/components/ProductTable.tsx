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

import EditProductDialog from "./EditProductDialog";
import DeleteProductDialog from "./DeleteProductDialog";

import { useProducts } from "../hooks/useProducts";

import type { Product } from "../types/product";

export default function ProductTable() {
  const {
    data: products = [],
    isLoading,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedProduct(null);
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
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  <Typography color="text.secondary">
                    No products found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  hover
                  key={product.id}
                >
                  <TableCell>
                    <Avatar
                      src={product.images?.[0] || ""}
                      variant="rounded"
                    >
                      {product.name.charAt(0)}
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    {product.name}
                  </TableCell>

                  <TableCell>
                    {product.category}
                  </TableCell>

                  <TableCell align="right">
                    ₹{product.price}
                  </TableCell>

                  <TableCell align="right">
                    {product.stock}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        product.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        product.isActive
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
                        handleEdit(product)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDelete(product)
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

      <EditProductDialog
        open={editOpen}
        product={selectedProduct}
        onClose={handleCloseEdit}
      />

      <DeleteProductDialog
        open={deleteOpen}
        productId={selectedProduct?.id ?? null}
        productName={
          selectedProduct?.name ?? ""
        }
        onClose={handleCloseDelete}
      />
    </>
  );
}