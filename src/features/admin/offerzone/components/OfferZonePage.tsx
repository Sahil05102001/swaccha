import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  Switch,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import ProductPicker from "@/features/admin/components/ProductPicker";
import ProductThumb from "@/features/admin/components/ProductThumb";
import { useProducts } from "@/features/products/hooks/useProducts";

import {
  useAddOfferZoneProduct,
  useDeleteOfferZoneProduct,
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
  useSaveGlobalProductStickerSettings,
  useUpdateOfferZoneProduct,
} from "../hooks/useOfferZone";
import {
  DEFAULT_GLOBAL_BADGE,
  DEFAULT_GLOBAL_PROMOTIONAL_STICKER,
  DEFAULT_GLOBAL_ROTATING_STICKER,
  MAX_BADGE_LENGTH,
  MAX_OFFER_ZONE_PRODUCTS,
} from "../types/offerZone";
import type {
  GlobalProductStickerSettings,
  OfferZoneProduct,
} from "../types/offerZone";

const PRODUCTS_PER_PAGE = 10;

const DEFAULT_SETTINGS: GlobalProductStickerSettings = {
  promotionalSticker: DEFAULT_GLOBAL_PROMOTIONAL_STICKER,
  rotatingSticker: DEFAULT_GLOBAL_ROTATING_STICKER,
  globalBadge: DEFAULT_GLOBAL_BADGE,
};

const pad3 = (texts: string[]) => [0, 1, 2].map((index) => texts[index] ?? "");

/** Same shape on both sides, so "unsaved changes" is judged fairly. */
function normalize(settings: GlobalProductStickerSettings) {
  return {
    promotionalSticker: {
      isEnabled: settings.promotionalSticker.isEnabled,
      text: settings.promotionalSticker.text.trim(),
    },
    rotatingSticker: {
      isEnabled: settings.rotatingSticker.isEnabled,
      texts: pad3(settings.rotatingSticker.texts.map((text) => text.trim()).filter(Boolean)),
      intervalSeconds: settings.rotatingSticker.intervalSeconds,
    },
    globalBadge: { text: (settings.globalBadge?.text ?? "").trim() },
  };
}

export default function OfferZonePage() {
  const { showSnackbar } = useSnackbar();

  const productsQuery = useProducts();
  const offerQuery = useOfferZoneProducts();
  const settingsQuery = useGlobalProductStickerSettings();

  const addOfferZoneProduct = useAddOfferZoneProduct();
  const updateOfferZoneProduct = useUpdateOfferZoneProduct();
  const deleteOfferZoneProduct = useDeleteOfferZoneProduct();
  const saveGlobalSettings = useSaveGlobalProductStickerSettings();

  const products = productsQuery.data ?? [];
  const offerZoneProducts = offerQuery.data ?? [];
  const savedSettings = settingsQuery.data ?? null;

  const [globalSettings, setGlobalSettings] =
    useState<GlobalProductStickerSettings>(DEFAULT_SETTINGS);
  const [settingsInitialized, setSettingsInitialized] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [overrideProductId, setOverrideProductId] = useState("");
  const [overrideEnabled, setOverrideEnabled] = useState(true);
  const [overrideText, setOverrideText] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (savedSettings && !settingsInitialized) {
      setGlobalSettings(savedSettings);
      setSettingsInitialized(true);
    }
  }, [savedSettings, settingsInitialized]);

  const isLoading =
    productsQuery.isLoading || offerQuery.isLoading || settingsQuery.isLoading;

  const isRefreshing =
    productsQuery.isRefetching || offerQuery.isRefetching || settingsQuery.isRefetching;

  const dirty =
    JSON.stringify(normalize(globalSettings)) !==
    JSON.stringify(normalize(savedSettings ?? DEFAULT_SETTINGS));

  const offerZoneProductMap = useMemo(
    () => new Map(offerZoneProducts.map((item) => [item.productId, item])),
    [offerZoneProducts],
  );

  const availableProducts = useMemo(
    () =>
      products.filter(
        (product) => product.isActive && !offerZoneProductMap.has(product.id),
      ),
    [products, offerZoneProductMap],
  );

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return offerZoneProducts.filter((item) => {
      const product = productById.get(item.productId);
      // Rows whose product is gone always stay visible, so they can be removed.
      return !term || !product || product.name.toLowerCase().includes(term);
    });
  }, [offerZoneProducts, productById, search]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const lastPage = Math.max(0, Math.ceil(rows.length / PRODUCTS_PER_PAGE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = rows.slice(
    currentPage * PRODUCTS_PER_PAGE,
    (currentPage + 1) * PRODUCTS_PER_PAGE,
  );

  const atLimit = offerZoneProducts.length >= MAX_OFFER_ZONE_PRODUCTS;

  const setRotatingText = (index: number, value: string) =>
    setGlobalSettings((current) => ({
      ...current,
      rotatingSticker: {
        ...current.rotatingSticker,
        texts: [0, 1, 2].map((i) =>
          i === index ? value : (current.rotatingSticker.texts[i] ?? ""),
        ),
      },
    }));

  const handleSaveGlobalSettings = async () => {
    const promotionalText = globalSettings.promotionalSticker.text.trim();
    const rotatingTexts = globalSettings.rotatingSticker.texts
      .map((text) => text.trim())
      .filter(Boolean);

    if (globalSettings.promotionalSticker.isEnabled && !promotionalText) {
      showSnackbar("Enter the promotional sticker text, or switch it off.", "error");
      return;
    }

    if (globalSettings.rotatingSticker.isEnabled && rotatingTexts.length === 0) {
      showSnackbar("Add at least one rotating text, or switch it off.", "error");
      return;
    }

    const toSave: GlobalProductStickerSettings = {
      promotionalSticker: {
        ...globalSettings.promotionalSticker,
        text: promotionalText,
      },
      rotatingSticker: {
        ...globalSettings.rotatingSticker,
        texts: rotatingTexts,
      },
      globalBadge: { text: (globalSettings.globalBadge?.text ?? "").trim() },
    };

    try {
      await saveGlobalSettings.mutateAsync(toSave);
      setGlobalSettings(toSave);
      showSnackbar("Sticker settings saved.", "success");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save sticker settings.",
        "error",
      );
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) return;

    if (atLimit) {
      showSnackbar(
        `You can add a maximum of ${MAX_OFFER_ZONE_PRODUCTS} Offer Zone products.`,
        "error",
      );
      return;
    }

    try {
      await addOfferZoneProduct.mutateAsync({
        productId: selectedProductId,
        promotionalSticker: { isEnabled: true, text: "ADD 3, PAY FOR 2" },
      });

      setSelectedProductId("");
      setSearch("");
      // Show the page that holds the new product.
      setPage(Math.ceil((offerZoneProducts.length + 1) / PRODUCTS_PER_PAGE) - 1);
      showSnackbar("Product added to Offer Zone.", "success");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to add the product.",
        "error",
      );
    }
  };

  const handleRemoveProduct = async (item: OfferZoneProduct) => {
    try {
      await deleteOfferZoneProduct.mutateAsync(item.id);

      if (overrideProductId === item.productId) setOverrideProductId("");

      showSnackbar("Product removed from Offer Zone.", "success");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to remove the product.",
        "error",
      );
    }
  };

  const handleEditOverride = (item: OfferZoneProduct) => {
    setOverrideProductId(item.productId);
    setOverrideEnabled(item.promotionalSticker.isEnabled);
    setOverrideText(item.promotionalSticker.text);
  };

  const handleSaveOverride = async (item: OfferZoneProduct) => {
    const text = overrideText.trim();

    if (overrideEnabled && !text) return;

    try {
      await updateOfferZoneProduct.mutateAsync({
        id: item.id,
        data: {
          productId: item.productId,
          promotionalSticker: { isEnabled: overrideEnabled, text },
        },
      });

      setOverrideProductId("");
      showSnackbar("Product sticker updated.", "success");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to update the sticker.",
        "error",
      );
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Offer Zone"
        subtitle="Manage the global product stickers and the products in the Offer Zone, each with its own promotional sticker."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              void productsQuery.refetch();
              void offerQuery.refetch();
              void settingsQuery.refetch();
            }}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={380} />
          <Skeleton variant="rounded" height={140} />
          <Skeleton variant="rounded" height={260} />
        </Stack>
      ) : (
        <Stack spacing={3}>
          <SectionCard
            title="Global stickers"
            subtitle="Shown on the product cards across the store."
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  disabled={!dirty || saveGlobalSettings.isPending}
                  onClick={() => setGlobalSettings(savedSettings ?? DEFAULT_SETTINGS)}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  disabled={!dirty || saveGlobalSettings.isPending}
                  onClick={() => void handleSaveGlobalSettings()}
                >
                  {saveGlobalSettings.isPending ? "Saving..." : "Save"}
                </Button>
              </Stack>
            }
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Promotional sticker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shown on products that are not in the Offer Zone.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={globalSettings.promotionalSticker.isEnabled}
                    onChange={(event) =>
                      setGlobalSettings((current) => ({
                        ...current,
                        promotionalSticker: {
                          ...current.promotionalSticker,
                          isEnabled: event.target.checked,
                        },
                      }))
                    }
                  />
                }
                label="Enable promotional sticker"
              />

              <TextField
                label="Promotional sticker text"
                value={globalSettings.promotionalSticker.text}
                onChange={(event) =>
                  setGlobalSettings((current) => ({
                    ...current,
                    promotionalSticker: {
                      ...current.promotionalSticker,
                      text: event.target.value,
                    },
                  }))
                }
                fullWidth
                disabled={!globalSettings.promotionalSticker.isEnabled}
              />

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Rotating sticker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The same rotating sticker is used on every product, including
                  Offer Zone products. Empty texts are skipped.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={globalSettings.rotatingSticker.isEnabled}
                    onChange={(event) =>
                      setGlobalSettings((current) => ({
                        ...current,
                        rotatingSticker: {
                          ...current.rotatingSticker,
                          isEnabled: event.target.checked,
                        },
                      }))
                    }
                  />
                }
                label="Enable rotating sticker"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                {[0, 1, 2].map((index) => (
                  <TextField
                    key={index}
                    label={`Rotating text ${index + 1}`}
                    value={globalSettings.rotatingSticker.texts[index] ?? ""}
                    onChange={(event) => setRotatingText(index, event.target.value)}
                    fullWidth
                    disabled={!globalSettings.rotatingSticker.isEnabled}
                  />
                ))}
              </Box>

              <TextField
                label="Rotation interval (seconds)"
                type="number"
                value={globalSettings.rotatingSticker.intervalSeconds}
                onChange={(event) => {
                  const value = Math.max(1, Number(event.target.value) || 1);

                  setGlobalSettings((current) => ({
                    ...current,
                    rotatingSticker: {
                      ...current.rotatingSticker,
                      intervalSeconds: value,
                    },
                  }));
                }}
                disabled={!globalSettings.rotatingSticker.isEnabled}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={{ maxWidth: 280 }}
              />

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Global product badge
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The corner tag for products that choose "Global badge" in
                  their product settings. It shows outside the New Arrivals,
                  Best Sellers and Offer Zone sections. Leave it empty to show
                  nothing.
                </Typography>
              </Box>

              <TextField
                label="Global badge text"
                value={globalSettings.globalBadge?.text ?? ""}
                onChange={(event) =>
                  setGlobalSettings((current) => ({
                    ...current,
                    globalBadge: { text: event.target.value },
                  }))
                }
                slotProps={{ htmlInput: { maxLength: MAX_BADGE_LENGTH } }}
                helperText={`Up to ${MAX_BADGE_LENGTH} characters, for example "Top Pick".`}
                sx={{ maxWidth: 280 }}
              />
            </Stack>
          </SectionCard>

          <SectionCard
            title="Add products to Offer Zone"
            subtitle={`Offer Zone products automatically get the OFFER ZONE badge. ${offerZoneProducts.length} of ${MAX_OFFER_ZONE_PRODUCTS} used.`}
          >
            {atLimit ? (
              <Alert severity="info">
                The Offer Zone is full. Remove a product to add another.
              </Alert>
            ) : (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
              >
                <ProductPicker
                  products={availableProducts}
                  value={selectedProductId}
                  onChange={setSelectedProductId}
                  disabled={addOfferZoneProduct.isPending}
                />

                <Button
                  variant="contained"
                  onClick={() => void handleAddProduct()}
                  disabled={!selectedProductId || addOfferZoneProduct.isPending}
                  sx={{ minWidth: 150, height: 56 }}
                >
                  {addOfferZoneProduct.isPending ? "Adding..." : "Add product"}
                </Button>
              </Stack>
            )}
          </SectionCard>

          <SectionCard
            title="Offer Zone products"
            subtitle="Each product can have its own promotional sticker. It follows the product everywhere it appears."
          >
            <Stack spacing={2}>
              {offerZoneProducts.length > PRODUCTS_PER_PAGE && (
                <TextField
                  size="small"
                  placeholder="Search by product name"
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
              )}

              {rows.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                  {offerZoneProducts.length === 0
                    ? "No products have been added to the Offer Zone yet."
                    : "No products match this search."}
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {visible.map((item) => {
                    const product = productById.get(item.productId);
                    const isEditing = overrideProductId === item.productId;

                    return (
                      <Card key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}
                          >
                            <ProductThumb
                              src={product?.images?.[0]}
                              alt={product?.name ?? ""}
                              size={56}
                            />

                            <Box sx={{ flex: 1, minWidth: 160 }}>
                              <Typography sx={{ fontWeight: 700 }}>
                                {product?.name ?? "Product not found"}
                              </Typography>

                              {product && (
                                <Typography variant="body2" color="text.secondary">
                                  ₹{product.price}
                                </Typography>
                              )}

                              <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 0.5 }}>
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  color={item.promotionalSticker.isEnabled ? "success" : "default"}
                                  label={
                                    item.promotionalSticker.isEnabled
                                      ? item.promotionalSticker.text || "Enabled, no text"
                                      : "Sticker off"
                                  }
                                />

                                {product && !product.isActive && (
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    label="Product inactive: hidden"
                                  />
                                )}
                              </Stack>
                            </Box>

                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              {product && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleEditOverride(item)}
                                >
                                  Edit sticker
                                </Button>
                              )}

                              <IconButton
                                color="error"
                                onClick={() => void handleRemoveProduct(item)}
                                disabled={deleteOfferZoneProduct.isPending}
                                aria-label="Remove from Offer Zone"
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Stack>
                          </Stack>

                          {isEditing && (
                            <Stack spacing={2}>
                              <Divider />

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={overrideEnabled}
                                    onChange={(event) => setOverrideEnabled(event.target.checked)}
                                  />
                                }
                                label="Show a promotional sticker on this product"
                              />

                              <TextField
                                label="Sticker text"
                                value={overrideText}
                                onChange={(event) => setOverrideText(event.target.value)}
                                fullWidth
                                disabled={!overrideEnabled}
                              />

                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="contained"
                                  onClick={() => void handleSaveOverride(item)}
                                  disabled={
                                    updateOfferZoneProduct.isPending ||
                                    (overrideEnabled && !overrideText.trim())
                                  }
                                >
                                  {updateOfferZoneProduct.isPending ? "Saving..." : "Save sticker"}
                                </Button>

                                <Button
                                  variant="outlined"
                                  onClick={() => setOverrideProductId("")}
                                  disabled={updateOfferZoneProduct.isPending}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              )}

              {rows.length > PRODUCTS_PER_PAGE && (
                <TablePagination
                  component="div"
                  count={rows.length}
                  page={currentPage}
                  onPageChange={(_, next) => setPage(next)}
                  rowsPerPage={PRODUCTS_PER_PAGE}
                  rowsPerPageOptions={[]}
                />
              )}
            </Stack>
          </SectionCard>
        </Stack>
      )}
    </PageContainer>
  );
}