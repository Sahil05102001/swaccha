import { memo, useCallback, useEffect, useMemo, useState } from "react";

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
  TablePagination,
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

const PAGE_SIZE = 10;

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Re-renders only when its own product changes.
const ProductRow = memo(function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Avatar
          src={product.images?.[0] || ""}
          variant="rounded"
          slotProps={{ img: { loading: "lazy" } }}
        >
          {product.name.charAt(0)}
        </Avatar>
      </TableCell>

      <TableCell>{product.name}</TableCell>

      <TableCell>{product.category}</TableCell>

      <TableCell align="right">₹{product.price}</TableCell>

      <TableCell align="right">{product.stock}</TableCell>

      <TableCell>
        {product.stock === 0 ? (
          <Chip label="Out of Stock" color="error" size="small" />
        ) : product.stock <= 5 ? (
          <Chip label="Low Stock" color="warning" size="small" />
        ) : (
          <Chip label="In Stock" color="success" size="small" />
        )}
      </TableCell>

      <TableCell>
        <Chip
          label={product.isActive ? "Active" : "Inactive"}
          color={product.isActive ? "success" : "default"}
          size="small"
        />
      </TableCell>

      <TableCell align="center">
        <IconButton
          size="small"
          aria-label={`Edit ${product.name}`}
          onClick={() => onEdit(product)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          aria-label={`Delete ${product.name}`}
          onClick={() => onDelete(product)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default function ProductTable() {
  const { data: products = [], isLoading } = useProducts();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Wait for the admin to stop typing before filtering.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword),
    );
  }, [products, search]);

  const lastPage = Math.max(
    0,
    Math.ceil(filteredProducts.length / PAGE_SIZE) - 1,
  );
  const currentPage = Math.min(page, lastPage);

  const visibleProducts = useMemo(
    () =>
      filteredProducts.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE,
      ),
    [filteredProducts, currentPage],
  );

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  }, []);

  const handleDelete = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  }, []);

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress aria-label="Loading products" />
      </Box>
    );
  }

  return (
    <>
      <TextField
        fullWidth
        label="Search products"
        placeholder="Search by name or category..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Inventory</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">
                    No products found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={currentPage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
        />
      </TableContainer>

      <EditProductDialog
        open={editOpen}
        product={selectedProduct}
        onClose={handleCloseEdit}
      />

      <DeleteProductDialog
        open={deleteOpen}
        productId={selectedProduct?.id ?? null}
        productName={selectedProduct?.name ?? ""}
        onClose={handleCloseDelete}
      />
    </>
  );
}