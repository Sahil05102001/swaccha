import { useMemo, useState } from "react";

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
  TextField,
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

  const [search, setSearch] =
    useState("");

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(keyword) ||
      product.category
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, search]);

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
      <TextField
        fullWidth
        label="Search products"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">
                Price
              </TableCell>
              <TableCell align="right">
                Stock
              </TableCell>
              <TableCell>
                Inventory
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.length ===
            0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  <Typography color="text.secondary">
                    No products found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map(
                (product) => (
                  <TableRow
                    hover
                    key={product.id}
                  >
                    <TableCell>
                      <Avatar
                        src={product.images?.[0] || ""}
                        variant="rounded"
                      >
                        {product.name.charAt(
                          0
                        )}
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
                      {product.stock ===
                      0 ? (
                        <Chip
                          label="Out of Stock"
                          color="error"
                          size="small"
                        />
                      ) : product.stock <=
                        5 ? (
                        <Chip
                          label="Low Stock"
                          color="warning"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="In Stock"
                          color="success"
                          size="small"
                        />
                      )}
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
                          handleEdit(
                            product
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
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
        productId={
          selectedProduct?.id ?? null
        }
        productName={
          selectedProduct?.name ?? ""
        }
        onClose={handleCloseDelete}
      />
    </>
  );
}