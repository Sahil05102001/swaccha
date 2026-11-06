import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  useAddOfferZoneProduct,
  useDeleteOfferZoneProduct,
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
  useSaveGlobalProductStickerSettings,
  useUpdateOfferZoneProduct,
} from "../hooks/useOfferZone";

import {
  DEFAULT_GLOBAL_PROMOTIONAL_STICKER,
  DEFAULT_GLOBAL_ROTATING_STICKER,
  MAX_OFFER_ZONE_PRODUCTS,
} from "../types/offerZone";

import type {
  GlobalProductStickerSettings,
  OfferZoneProduct,
} from "../types/offerZone";

import { useProducts } from "@/features/products/hooks/useProducts";

const PRODUCTS_PER_PAGE = 10;

export default function OfferZonePage() {
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useProducts();

  const {
    data: offerZoneProducts = [],
    isLoading: offerZoneLoading,
  } = useOfferZoneProducts();

  const {
    data: savedStickerSettings,
    isLoading: settingsLoading,
  } = useGlobalProductStickerSettings();

  const addOfferZoneProduct =
    useAddOfferZoneProduct();

  const updateOfferZoneProduct =
    useUpdateOfferZoneProduct();

  const deleteOfferZoneProduct =
    useDeleteOfferZoneProduct();

  const saveGlobalSettings =
    useSaveGlobalProductStickerSettings();

  const [page, setPage] = useState(1);

  const [globalSettings, setGlobalSettings] =
    useState<GlobalProductStickerSettings>({
      promotionalSticker:
        DEFAULT_GLOBAL_PROMOTIONAL_STICKER,
      rotatingSticker:
        DEFAULT_GLOBAL_ROTATING_STICKER,
    });

  const [settingsInitialized, setSettingsInitialized] =
    useState(false);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [overrideProductId, setOverrideProductId] =
    useState("");

  const [overrideEnabled, setOverrideEnabled] =
    useState(true);

  const [overrideText, setOverrideText] =
    useState("ADD 3, PAY FOR 2");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (
      savedStickerSettings &&
      !settingsInitialized
    ) {
      setGlobalSettings(savedStickerSettings);
      setSettingsInitialized(true);
    }
  }, [
    savedStickerSettings,
    settingsInitialized,
  ]);

  const offerZoneProductMap = useMemo(() => {
    return new Map(
      offerZoneProducts.map((item) => [
        item.productId,
        item,
      ])
    );
  }, [offerZoneProducts]);

  const availableProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.isActive &&
        !offerZoneProductMap.has(product.id)
    );
  }, [products, offerZoneProductMap]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      offerZoneProducts.length /
      PRODUCTS_PER_PAGE
    )
  );

  const paginatedOfferZoneProducts =
    useMemo(() => {
      const startIndex =
        (page - 1) * PRODUCTS_PER_PAGE;

      return offerZoneProducts.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE
      );
    }, [offerZoneProducts, page]);

  useEffect(() => {
    setPage((currentPage) =>
      Math.min(currentPage, totalPages)
    );
  }, [totalPages]);

  const getProduct = (
    productId: string
  ) => {
    return products.find(
      (product) => product.id === productId
    );
  };

  const showMessage = (message: string) => {
    setSnackbar({
      open: true,
      message,
    });
  };

  const handleSaveGlobalSettings =
    async () => {
      try {
        await saveGlobalSettings.mutateAsync(
          globalSettings
        );

        showMessage(
          "Global sticker settings saved successfully."
        );
      } catch (error) {
        showMessage(
          error instanceof Error
            ? error.message
            : "Failed to save global sticker settings."
        );
      }
    };

  const handleAddProduct = async () => {
    if (!selectedProductId) {
      return;
    }

    if (
      offerZoneProducts.length >=
      MAX_OFFER_ZONE_PRODUCTS
    ) {
      showMessage(
        `You can add a maximum of ${MAX_OFFER_ZONE_PRODUCTS} Offer Zone products.`
      );
      return;
    }

    try {
      await addOfferZoneProduct.mutateAsync({
        productId: selectedProductId,
        promotionalSticker: {
          isEnabled: true,
          text: "ADD 3, PAY FOR 2",
        },
      });

      setSelectedProductId("");

      const newTotal =
        offerZoneProducts.length + 1;

      setPage(
        Math.ceil(
          newTotal / PRODUCTS_PER_PAGE
        )
      );

      showMessage(
        "Product added to Offer Zone."
      );
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to add product to Offer Zone."
      );
    }
  };

  const handleRemoveProduct = async (
    item: OfferZoneProduct
  ) => {
    try {
      await deleteOfferZoneProduct.mutateAsync(
        item.id
      );

      const newTotal =
        offerZoneProducts.length - 1;

      const newTotalPages = Math.max(
        1,
        Math.ceil(
          newTotal / PRODUCTS_PER_PAGE
        )
      );

      setPage((currentPage) =>
        Math.min(currentPage, newTotalPages)
      );

      if (
        overrideProductId === item.productId
      ) {
        setOverrideProductId("");
      }

      showMessage(
        "Product removed from Offer Zone."
      );
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to remove product."
      );
    }
  };

  const handleUpdateOverride =
    async (item: OfferZoneProduct) => {
      const trimmedText =
        overrideText.trim();

      if (
        overrideEnabled &&
        !trimmedText
      ) {
        return;
      }

      try {
        await updateOfferZoneProduct.mutateAsync(
          {
            id: item.id,
            data: {
              productId: item.productId,
              promotionalSticker: {
                isEnabled: overrideEnabled,
                text: trimmedText,
              },
            },
          }
        );

        setOverrideProductId("");

        showMessage(
          "Promotional sticker override updated."
        );
      } catch (error) {
        showMessage(
          error instanceof Error
            ? error.message
            : "Failed to update promotional sticker."
        );
      }
    };

  const handleEditOverride = (
    item: OfferZoneProduct
  ) => {
    setOverrideProductId(item.productId);

    setOverrideEnabled(
      item.promotionalSticker.isEnabled
    );

    setOverrideText(
      item.promotionalSticker.text
    );
  };

  const isLoading =
    productsLoading ||
    offerZoneLoading ||
    settingsLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Offer Zone
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            Manage global product stickers and
            products with their own promotional
            sticker overrides.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Global Promotional Sticker
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  This sticker is shown on products
                  that are not in Offer Zone.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      globalSettings
                        .promotionalSticker
                        .isEnabled
                    }
                    onChange={(event) =>
                      setGlobalSettings(
                        (current) => ({
                          ...current,
                          promotionalSticker: {
                            ...current
                              .promotionalSticker,
                            isEnabled:
                              event.target
                                .checked,
                          },
                        })
                      )
                    }
                  />
                }
                label="Enable promotional sticker"
              />

              <TextField
                label="Promotional sticker text"
                value={
                  globalSettings.promotionalSticker
                    .text
                }
                onChange={(event) =>
                  setGlobalSettings(
                    (current) => ({
                      ...current,
                      promotionalSticker: {
                        ...current
                          .promotionalSticker,
                        text: event.target.value,
                      },
                    })
                  )
                }
                fullWidth
                disabled={
                  !globalSettings
                    .promotionalSticker
                    .isEnabled
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Divider />

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Global Rotating Sticker
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  The same rotating sticker is used
                  across every product, including
                  Offer Zone products.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      globalSettings
                        .rotatingSticker
                        .isEnabled
                    }
                    onChange={(event) =>
                      setGlobalSettings(
                        (current) => ({
                          ...current,
                          rotatingSticker: {
                            ...current
                              .rotatingSticker,
                            isEnabled:
                              event.target
                                .checked,
                          },
                        })
                      )
                    }
                  />
                }
                label="Enable rotating sticker"
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  gap: 2,
                }}
              >
                {[0, 1, 2].map((index) => (
                  <TextField
                    key={index}
                    label={`Rotating text ${index + 1
                      }`}
                    value={
                      globalSettings
                        .rotatingSticker
                        .texts[index] ?? ""
                    }
                    onChange={(event) => {
                      const texts = [
                        ...globalSettings
                          .rotatingSticker.texts,
                      ];

                      texts[index] =
                        event.target.value;

                      setGlobalSettings(
                        (current) => ({
                          ...current,
                          rotatingSticker: {
                            ...current
                              .rotatingSticker,
                            texts,
                          },
                        })
                      );
                    }}
                    fullWidth
                    disabled={
                      !globalSettings
                        .rotatingSticker
                        .isEnabled
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                ))}
              </Box>

              <TextField
                label="Rotation interval (seconds)"
                type="number"
                value={
                  globalSettings.rotatingSticker
                    .intervalSeconds
                }
                onChange={(event) => {
                  const value = Math.max(
                    1,
                    Number(event.target.value) || 1
                  );

                  setGlobalSettings(
                    (current) => ({
                      ...current,
                      rotatingSticker: {
                        ...current
                          .rotatingSticker,
                        intervalSeconds: value,
                      },
                    })
                  );
                }}
                disabled={
                  !globalSettings.rotatingSticker
                    .isEnabled
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    min: 1,
                  },
                }}
                sx={{ maxWidth: 280 }}
              />

              <Box>
                <Button
                  variant="contained"
                  onClick={
                    handleSaveGlobalSettings
                  }
                  disabled={
                    saveGlobalSettings.isPending
                  }
                >
                  {saveGlobalSettings.isPending
                    ? "Saving..."
                    : "Save Global Settings"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Add Products to Offer Zone
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Offer Zone products automatically
                  receive the OFFER ZONE badge.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                }}
              >
                <Select
                  value={selectedProductId}
                  onChange={(event) =>
                    setSelectedProductId(
                      event.target.value
                    )
                  }
                  displayEmpty
                  fullWidth
                  disabled={
                    offerZoneProducts.length >=
                    MAX_OFFER_ZONE_PRODUCTS ||
                    addOfferZoneProduct.isPending
                  }
                  MenuProps={{
                    slotProps: {
                      paper: {
                        sx: {
                          maxHeight: 320,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a product</em>
                  </MenuItem>

                  {availableProducts.map(
                    (product) => (
                      <MenuItem
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </MenuItem>
                    )
                  )}
                </Select>

                <Button
                  variant="contained"
                  onClick={handleAddProduct}
                  disabled={
                    !selectedProductId ||
                    offerZoneProducts.length >=
                    MAX_OFFER_ZONE_PRODUCTS ||
                    addOfferZoneProduct.isPending
                  }
                  sx={{
                    minWidth: 150,
                  }}
                >
                  {addOfferZoneProduct.isPending
                    ? "Adding..."
                    : "Add Product"}
                </Button>
              </Box>

              <Alert severity="info">
                {offerZoneProducts.length} of{" "}
                {MAX_OFFER_ZONE_PRODUCTS} Offer Zone
                products are currently configured.
              </Alert>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Offer Zone Products
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Each product can have its own
                  promotional sticker. This override
                  follows the product everywhere it
                  appears.
                </Typography>
              </Box>

              {paginatedOfferZoneProducts.length ===
                0 ? (
                <Alert severity="info">
                  No products have been added to
                  Offer Zone yet.
                </Alert>
              ) : (
                <Box
                  sx={{
                    maxHeight: { xs: 520, md: 620 },
                    overflowY: "auto",
                    pr: { xs: 0.5, sm: 1 },
                    mr: -0.5,
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 4,
                      backgroundColor: "rgba(47, 107, 59, 0.28)",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {paginatedOfferZoneProducts.map(
                      (item) => {
                        const product = getProduct(
                          item.productId
                        );

                        if (!product) {
                          return (
                            <Card
                              key={item.id}
                              variant="outlined"
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent:
                                      "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography>
                                    Product not found
                                  </Typography>

                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleRemoveProduct(
                                        item
                                      )
                                    }
                                    disabled={
                                      deleteOfferZoneProduct
                                        .isPending
                                    }
                                  >
                                    ×
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        }

                        const isEditing =
                          overrideProductId ===
                          item.productId;

                        return (
                          <Card
                            key={item.id}
                            variant="outlined"
                          >
                            <CardContent>
                              <Stack spacing={2}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: {
                                      xs: "column",
                                      md: "row",
                                    },
                                    gap: 2,
                                    alignItems: {
                                      xs: "stretch",
                                      md: "center",
                                    },
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={
                                      product.images[0]
                                    }
                                    alt={product.name}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      objectFit:
                                        "contain",
                                      borderRadius: 2,
                                      bgcolor:
                                        "grey.50",
                                    }}
                                  />

                                  <Box
                                    sx={{
                                      flex: 1,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                      }}
                                    >
                                      {product.name}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      ₹{product.price}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="error"
                                      sx={{
                                        mt: 0.5,
                                        fontWeight: 700,
                                      }}
                                    >
                                      OFFER ZONE
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      alignItems:
                                        "center",
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      onClick={() =>
                                        handleEditOverride(
                                          item
                                        )
                                      }
                                    >
                                      Edit Sticker
                                    </Button>

                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleRemoveProduct(
                                          item
                                        )
                                      }
                                      disabled={
                                        deleteOfferZoneProduct
                                          .isPending
                                      }
                                    >
                                      ×
                                    </IconButton>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor:
                                      "grey.50",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    Current promotional
                                    sticker
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                    }}
                                  >
                                    {item.promotionalSticker
                                      .isEnabled
                                      ? item
                                        .promotionalSticker
                                        .text ||
                                      "Enabled with empty text"
                                      : "Disabled"}
                                  </Typography>
                                </Box>

                                {isEditing && (
                                  <Stack spacing={2}>
                                    <Divider />

                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: 700,
                                      }}
                                    >
                                      Product Promotional
                                      Sticker Override
                                    </Typography>

                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            overrideEnabled
                                          }
                                          onChange={(
                                            event
                                          ) =>
                                            setOverrideEnabled(
                                              event.target
                                                .checked
                                            )
                                          }
                                        />
                                      }
                                      label="Enable promotional sticker for this product"
                                    />

                                    <TextField
                                      label="Sticker text"
                                      value={
                                        overrideText
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setOverrideText(
                                          event.target
                                            .value
                                        )
                                      }
                                      fullWidth
                                      disabled={
                                        !overrideEnabled
                                      }
                                      slotProps={{
                                        inputLabel: {
                                          shrink: true,
                                        },
                                      }}
                                    />

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        onClick={() =>
                                          handleUpdateOverride(
                                            item
                                          )
                                        }
                                        disabled={
                                          updateOfferZoneProduct
                                            .isPending ||
                                          (overrideEnabled &&
                                            !overrideText.trim())
                                        }
                                      >
                                        {updateOfferZoneProduct
                                          .isPending
                                          ? "Saving..."
                                          : "Save Override"}
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        onClick={() =>
                                          setOverrideProductId(
                                            ""
                                          )
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </Box>
                                  </Stack>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </Stack>
                </Box>
              )}

              {offerZoneProducts.length >
                PRODUCTS_PER_PAGE && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pt: 1,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) =>
                        setPage(value)
                      }
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
        message={snackbar.message}
      />
    </Box>
  );
}