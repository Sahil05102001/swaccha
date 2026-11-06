import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import ProductCard from "@/components/product/ProductCard";

import {
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";

import { useProducts } from "@/features/products/hooks/useProducts";

export default function FeaturedProducts() {
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  const {
    data: offerZoneProducts = [],
    isLoading: isOfferZoneLoading,
    isError: isOfferZoneError,
  } = useOfferZoneProducts();

  const {
    data: globalStickerSettings,
    isLoading: isStickerSettingsLoading,
    isError: isStickerSettingsError,
  } = useGlobalProductStickerSettings();

  const featuredProducts = products
    .filter(
      (product) =>
        product.isFeatured && product.isActive,
    )
    .slice(0, 5);

  const isLoading =
    isProductsLoading ||
    isOfferZoneLoading ||
    isStickerSettingsLoading;

  const isError =
    isProductsError ||
    isOfferZoneError ||
    isStickerSettingsError;

  const offerZoneProductMap = new Map(
    offerZoneProducts.map((offerZoneProduct) => [
      offerZoneProduct.productId,
      offerZoneProduct,
    ]),
  );

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#F5F7FA",
        py: {
          xs: 4.5,
          sm: 5.5,
          md: 6,
          lg: 6.5,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",

          // Was "100%", which let the cards keep growing on big screens.
          // With 5 columns this keeps each card at roughly 250px.
          maxWidth: 1400,

          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
        }}
      >
        {/* Section heading */}
        <Typography
          component="h2"
          sx={{
            color: "#111111",
            textAlign: "center",

            fontSize: {
              xs: "2rem",
              sm: "2.3rem",
              md: "2.65rem",
              lg: "2.9rem",
            },

            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.045em",

            mb: {
              xs: 3,
              sm: 3.5,
              md: 4,
            },
          }}
        >
          New Arrivals
        </Typography>

        {/* Loading */}
        {isLoading && (
          <Box
            sx={{
              minHeight: {
                xs: 320,
                sm: 390,
                md: 430,
              },

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={32}
              thickness={4}
            />
          </Box>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#C62828",
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                },
              }}
            >
              Unable to load new arrivals.
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          featuredProducts.length === 0 && (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#667066",
                  fontSize: "0.9rem",
                }}
              >
                No new arrivals available.
              </Typography>
            </Box>
          )}

        {/* Products */}
        {!isLoading &&
          !isError &&
          featuredProducts.length > 0 && (
            <>
              {/* Mobile carousel */}
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "none",
                  },

                  width: "100%",

                  overflowX: "auto",
                  overflowY: "hidden",

                  gap: {
                    xs: 1.5,
                    sm: 2,
                  },

                  pb: 1,

                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",

                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {featuredProducts.map((product) => {
                  const offerZoneProduct =
                    offerZoneProductMap.get(
                      product.id,
                    );

                  const promotionalSticker =
                    offerZoneProduct
                      ? offerZoneProduct.promotionalSticker
                      : globalStickerSettings
                          ?.promotionalSticker;

                  return (
                    <Box
                      key={product.id}
                      sx={{
                        // Fixed slide widths (were 78% / 300px).
                        // About 1.9 cards show on a phone, so the next one peeks in.
                        flex: {
                          xs: "0 0 175px",
                          sm: "0 0 220px",
                        },

                        width: {
                          xs: 175,
                          sm: 220,
                        },

                        minWidth: 0,
                      }}
                    >
                      <ProductCard
                        product={product}
                        compact
                        showProductStickers
                        promotionalSticker={
                          promotionalSticker
                        }
                        rotatingSticker={
                          globalStickerSettings?.rotatingSticker
                        }
                        isOfferZoneProduct={Boolean(
                          offerZoneProduct,
                        )}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* Desktop - exactly five cards */}
              <Box
                sx={{
                  display: {
                    xs: "none",
                    md: "grid",
                  },

                  width: "100%",

                  gridTemplateColumns:
                    "repeat(5, minmax(0, 1fr))",

                  gap: {
                    md: 2,
                    lg: 2.2,
                    xl: 2.5,
                  },

                  alignItems: "stretch",
                }}
              >
                {featuredProducts.map((product) => {
                  const offerZoneProduct =
                    offerZoneProductMap.get(
                      product.id,
                    );

                  const promotionalSticker =
                    offerZoneProduct
                      ? offerZoneProduct.promotionalSticker
                      : globalStickerSettings
                          ?.promotionalSticker;

                  return (
                    <Box
                      key={product.id}
                      sx={{
                        minWidth: 0,
                        display: "flex",
                      }}
                    >
                      <ProductCard
                        product={product}
                        compact
                        showProductStickers
                        promotionalSticker={
                          promotionalSticker
                        }
                        rotatingSticker={
                          globalStickerSettings?.rotatingSticker
                        }
                        isOfferZoneProduct={Boolean(
                          offerZoneProduct,
                        )}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* View All */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",

                  mt: {
                    xs: 4,
                    sm: 4.5,
                    md: 5,
                  },
                }}
              >
                <Button
                  component={Link}
                  to="/products"
                  variant="outlined"
                  sx={{
                    minWidth: {
                      xs: 132,
                      sm: 145,
                    },

                    minHeight: {
                      xs: 42,
                      sm: 46,
                    },

                    px: 3,

                    borderRadius: 999,

                    border: "1px solid #111111",

                    backgroundColor:
                      "rgba(255,255,255,0.25)",

                    color: "#111111",

                    fontSize: {
                      xs: "0.72rem",
                      sm: "0.76rem",
                    },

                    fontWeight: 600,

                    letterSpacing: "0.16em",

                    textTransform: "uppercase",

                    boxShadow: "none",

                    "&:hover": {
                      backgroundColor:
                        "rgba(255,255,255,0.25)",
                      borderColor: "#111111",
                      boxShadow: "none",
                    },
                  }}
                >
                  View All
                </Button>
              </Box>
            </>
          )}
      </Container>
    </Box>
  );
}
