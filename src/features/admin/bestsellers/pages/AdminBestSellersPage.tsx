import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import ProductPicker from "@/features/admin/components/ProductPicker";
import ProductThumb from "@/features/admin/components/ProductThumb";
import { useProducts } from "@/features/admin/products/hooks/useProducts";

import {
  useBestSellers,
  useCreateBestSeller,
  useDeleteBestSeller,
  useUpdateBestSeller,
} from "../hooks/useBestSellers";
import type { BestSeller } from "../types/bestSeller";

const POSITIONS = [1, 2, 3, 4, 5];

export default function AdminBestSellersPage() {
  const { showSnackbar } = useSnackbar();

  const productsQuery = useProducts();
  const sellersQuery = useBestSellers();

  const createMutation = useCreateBestSeller();
  const updateMutation = useUpdateBestSeller();
  const deleteMutation = useDeleteBestSeller();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(1);

  const products = productsQuery.data ?? [];

  const sellers = useMemo(
    () => [...(sellersQuery.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [sellersQuery.data],
  );

  const usedPositions = new Set(sellers.map((seller) => seller.sortOrder));
  const freePositions = POSITIONS.filter((position) => !usedPositions.has(position));

  // Keep the chosen position valid as positions get used up.
  const addPosition = freePositions.includes(selectedPosition)
    ? selectedPosition
    : (freePositions[0] ?? 0);

  const usedProductIds = new Set(sellers.map((seller) => seller.productId));

  const availableProducts = products.filter(
    (product) => product.isActive && !usedProductIds.has(product.id),
  );

  const activeCount = sellers.filter((seller) => seller.isActive).length;

  const isLoading = productsQuery.isLoading || sellersQuery.isLoading;
  const isRefreshing = productsQuery.isRefetching || sellersQuery.isRefetching;
  const busy =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleAdd = async () => {
    if (!selectedProduct || !addPosition) return;

    try {
      await createMutation.mutateAsync({
        productId: selectedProduct,
        sortOrder: addPosition,
        isActive: true,
      });

      setSelectedProduct("");
      showSnackbar("Best seller added.", "success");
    } catch {
      showSnackbar("Failed to add the best seller.", "error");
    }
  };

  const handleUpdate = async (
    seller: BestSeller,
    changes: Partial<Pick<BestSeller, "sortOrder" | "isActive">>,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: seller.id,
        data: {
          productId: seller.productId,
          sortOrder: changes.sortOrder ?? seller.sortOrder,
          isActive: changes.isActive ?? seller.isActive,
        },
      });
    } catch {
      showSnackbar("Failed to update the best seller.", "error");
    }
  };

  const handleRemove = async (seller: BestSeller) => {
    try {
      await deleteMutation.mutateAsync(seller.id);
      showSnackbar("Best seller removed.", "success");
    } catch {
      showSnackbar("Failed to remove the best seller.", "error");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Best Sellers"
        subtitle={`${activeCount} active · ${sellers.length}/5 positions used. Active best sellers are shown on the homepage in position order.`}
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              void productsQuery.refetch();
              void sellersQuery.refetch();
            }}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      <Stack spacing={3}>
        <SectionCard title="Add best seller">
          {freePositions.length === 0 ? (
            <Alert severity="info">
              All 5 positions are used. Remove a best seller to add another.
            </Alert>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
            >
              <ProductPicker
                products={availableProducts}
                value={selectedProduct}
                onChange={setSelectedProduct}
                disabled={isLoading || createMutation.isPending}
              />

              <AdminSelect
                label="Position"
                value={addPosition}
                onChange={(event) => setSelectedPosition(Number(event.target.value))}
                disabled={createMutation.isPending}
                sx={{ minWidth: 140 }}
              >
                {freePositions.map((position) => (
                  <MenuItem key={position} value={position}>
                    Position {position}
                  </MenuItem>
                ))}
              </AdminSelect>

              <Button
                variant="contained"
                onClick={() => void handleAdd()}
                disabled={!selectedProduct || createMutation.isPending}
                sx={{ minWidth: 110, height: 56 }}
              >
                {createMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </Stack>
          )}
        </SectionCard>

        <SectionCard title="Current best sellers">
          {isLoading ? (
            <Stack spacing={1.5}>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} variant="rounded" height={84} />
              ))}
            </Stack>
          ) : sellers.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              No best sellers have been added yet.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {sellers.map((seller) => {
                const product = products.find((item) => item.id === seller.productId);

                const positionOptions = POSITIONS.filter(
                  (position) =>
                    position === seller.sortOrder || !usedPositions.has(position),
                );

                if (!POSITIONS.includes(seller.sortOrder)) {
                  positionOptions.push(seller.sortOrder);
                }

                return (
                  <Card
                    key={seller.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <ProductThumb src={product?.images?.[0]} alt={product?.name ?? ""} size={56} />

                    <Box sx={{ flex: 1, minWidth: 160 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {product?.name ?? "Product not found"}
                      </Typography>

                      {product && (
                        <Typography variant="body2" color="text.secondary">
                          ₹{product.price.toLocaleString("en-IN")}
                        </Typography>
                      )}

                      {product && !product.isActive && (
                        <Chip
                          size="small"
                          variant="outlined"
                          color="warning"
                          label="Product inactive: hidden on homepage"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>

                    <AdminSelect
                      size="small"
                      label="Position"
                      value={seller.sortOrder}
                      onChange={(event) =>
                        void handleUpdate(seller, {
                          sortOrder: Number(event.target.value),
                        })
                      }
                      disabled={busy}
                      sx={{ minWidth: 130 }}
                    >
                      {positionOptions.map((position) => (
                        <MenuItem key={position} value={position}>
                          Position {position}
                        </MenuItem>
                      ))}
                    </AdminSelect>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={seller.isActive}
                          onChange={(event) =>
                            void handleUpdate(seller, { isActive: event.target.checked })
                          }
                          disabled={busy}
                        />
                      }
                      label="Active"
                    />

                    <IconButton
                      color="error"
                      onClick={() => void handleRemove(seller)}
                      disabled={busy}
                      aria-label="Remove best seller"
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Card>
                );
              })}
            </Stack>
          )}
        </SectionCard>
      </Stack>
    </PageContainer>
  );
}