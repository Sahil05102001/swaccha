import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import ProductThumb from "@/features/admin/components/ProductThumb";
import {
  useProducts,
  useUpdateProductFeatured,
} from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types/product";

const MAX_FEATURED = 5;
const PAGE_SIZE = 10;

export default function AdminFeaturedProductsPage() {
  const { showSnackbar } = useSnackbar();

  const { data: products = [], isLoading, isError, refetch, isRefetching } = useProducts();
  const updateMutation = useUpdateProductFeatured();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [page, setPage] = useState(0);

  const featuredCount = products.filter((product) => product.isFeatured).length;
  const limitReached = featuredCount >= MAX_FEATURED;

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (filter === "featured" && !product.isFeatured) return false;
        if (!term) return true;

        return (
          product.name.toLowerCase().includes(term) ||
          (product.category ?? "").toLowerCase().includes(term)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, search, filter]);

  useEffect(() => {
    setPage(0);
  }, [search, filter]);

  const lastPage = Math.max(0, Math.ceil(rows.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = rows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleToggle = async (product: Product) => {
    const shouldFeature = !product.isFeatured;

    if (shouldFeature && limitReached) {
      showSnackbar("You can only have 5 featured products.", "error");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: product.id,
        isFeatured: shouldFeature,
      });

      showSnackbar(
        shouldFeature ? "Added to featured products." : "Removed from featured products.",
        "success",
      );
    } catch {
      showSnackbar("Failed to update the featured product.", "error");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Featured Products"
        subtitle="Choose up to 5 products for the New Arrivals section on the homepage. They get the New tag there."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      <Stack spacing={3}>
        <SectionCard
          title={`${featuredCount} of ${MAX_FEATURED} selected`}
          subtitle={
            limitReached
              ? "The limit is reached. Untick a product to choose another."
              : "Only active products appear on the homepage, even if they are ticked."
          }
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by name or category"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              label="Show"
              value={filter}
              onChange={(event) => setFilter(event.target.value as "all" | "featured")}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All products</MenuItem>
              <MenuItem value="featured">Featured only</MenuItem>
            </AdminSelect>
          </Stack>
        </SectionCard>

        <SectionCard>
          {isError ? (
            <Alert severity="error">Failed to load products.</Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Product</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Category
                    </TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    [0, 1, 2, 3, 4].map((row) => (
                      <TableRow key={row}>
                        {[0, 1, 2, 3, 4].map((cell) => (
                          <TableCell
                            key={cell}
                            sx={cell === 2 ? { display: { xs: "none", sm: "table-cell" } } : undefined}
                          >
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visible.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          {products.length === 0
                            ? "No products available."
                            : "No products match this search."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((product) => {
                      const checked = Boolean(product.isFeatured);
                      const disabled =
                        updateMutation.isPending || (!checked && limitReached);

                      return (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={checked}
                              disabled={disabled}
                              onChange={() => void handleToggle(product)}
                              slotProps={{
                                input: { "aria-label": `Feature ${product.name}` },
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                              <ProductThumb src={product.images?.[0]} alt={product.name} />
                              <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600 }}>{product.name}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                            {product.category}
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                            ₹{product.price}
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
                              {checked && (
                                <Chip size="small" variant="outlined" color="success" label="Featured" />
                              )}
                              {!product.isActive && (
                                <Chip size="small" variant="outlined" color="error" label="Inactive" />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {rows.length > PAGE_SIZE && (
            <TablePagination
              component="div"
              count={rows.length}
              page={currentPage}
              onPageChange={(_, next) => setPage(next)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[]}
            />
          )}
        </SectionCard>
      </Stack>
    </PageContainer>
  );
}