import { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
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

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";

import AdminSelect from "@/features/admin/components/AdminSelect";

import DeleteProductDialog from "./DeleteProductDialog";
import EditProductDialog from "./EditProductDialog";

import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import { cloudinaryThumb } from "../utils/imageUrl";

const PAGE_SIZE = 10;

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

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
  const image = product.images?.[0];
  const hasDiscount = product.mrp > product.price && product.price > 0;

  return (
    <TableRow>
      <TableCell sx={{ minWidth: 220 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#F9FAFB",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {image ? (
              <Box
                component="img"
                src={cloudinaryThumb(image, 96)}
                alt=""
                loading="lazy"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {product.name.charAt(0)}
              </Typography>
            )}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {product.sku ? `SKU ${product.sku}` : "No SKU"}
              <Box component="span" sx={{ display: { md: "none" } }}>
                {` · ${product.category}`}
              </Box>
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        {product.category}
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {inr(product.price)}
        </Typography>

        {hasDiscount && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            {inr(product.mrp)}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
          <Typography variant="body2">{product.stock}</Typography>

          {product.stock === 0 ? (
            <Chip label="Out of stock" color="error" size="small" variant="outlined" />
          ) : product.stock <= 5 ? (
            <Chip label="Low stock" color="warning" size="small" variant="outlined" />
          ) : (
            <Chip label="In stock" color="success" size="small" variant="outlined" />
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Chip
          label={product.isActive ? "Active" : "Inactive"}
          color={product.isActive ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        <IconButton
          size="small"
          aria-label={`Edit ${product.name}`}
          onClick={() => onEdit(product)}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          aria-label={`Delete ${product.name}`}
          onClick={() => onDelete(product)}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default function ProductTable() {
  const { data: products = [], isLoading } = useProducts();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
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

  // Categories that actually have products (no extra database read).
  const categoryOptions = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (status === "active" && !product.isActive) return false;
      if (status === "inactive" && product.isActive) return false;

      if (!keyword) return true;

      return (
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        (product.sku ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [products, search, category, status]);

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

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, SKU or category"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <AdminSelect
          size="small"
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: { md: 200 } }}
        >
          <MenuItem value="">All categories</MenuItem>
          {categoryOptions.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </AdminSelect>

        <AdminSelect
          size="small"
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: { md: 160 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </AdminSelect>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Category
              </TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Status
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [0, 1, 2, 3, 4].map((row) => (
                <TableRow key={row}>
                  {[0, 1, 2, 3, 4, 5].map((cell) => (
                    <TableCell
                      key={cell}
                      sx={
                        cell === 1 || cell === 4
                          ? { display: { xs: "none", md: "table-cell" } }
                          : undefined
                      }
                    >
                      <Skeleton height={32} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : visibleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    {products.length === 0
                      ? "No products yet. Use “Add product” to create one."
                      : "No products match your search or filters."}
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
      </TableContainer>

      {filteredProducts.length > PAGE_SIZE && (
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={currentPage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[]}
        />
      )}

      <EditProductDialog
        open={editOpen}
        product={selectedProduct}
        onClose={handleCloseEdit}
      />

      <DeleteProductDialog
        open={deleteOpen}
        productId={selectedProduct?.id ?? null}
        productName={selectedProduct?.name ?? ""}
        imagePublicId={selectedProduct?.imagePublicId}
        onClose={handleCloseDelete}
      />
    </>
  );
}