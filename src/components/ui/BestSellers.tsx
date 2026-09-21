import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import ProductCard from "@/components/product/ProductCard";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useBestSellers } from "@/features/admin/bestsellers/hooks/useBestSellers";

import {
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";

export default function BestSellers() {
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useProducts();

  const {
    data: bestSellers = [],
    isLoading: bestSellersLoading,
  } = useBestSellers();

  const {
    data: stickerSettings,
    isLoading: stickerSettingsLoading,
  } = useGlobalProductStickerSettings();

  const {
    data: offerZoneProducts = [],
    isLoading: offerZoneLoading,
  } = useOfferZoneProducts();

  const isLoading =
    productsLoading ||
    bestSellersLoading ||
    stickerSettingsLoading ||
    offerZoneLoading;

  const bestSellerProducts = bestSellers
    .filter((item) => item.isActive)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder
    )
    .map((item) =>
      products.find(
        (product) =>
          product.id === item.productId
      )
    )
    .filter(
      (
        product
      ): product is NonNullable<typeof product> =>
        Boolean(
          product && product.isActive
        )
    )
    .slice(0, 5);

  const offerZoneProductMap = new Map(
    offerZoneProducts.map((item) => [
      item.productId,
      item,
    ])
  );

  return (
    <Box
      sx={{
        py: {
          xs: 6,
          md: 8,
        },
        bgcolor: "#fff",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: "center",
            mb: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "2rem",
                md: "2.5rem",
              },
            }}
          >
            Best Sellers
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "text.secondary",
              fontSize: {
                xs: "0.95rem",
                md: "1rem",
              },
            }}
          >
            Our most popular cleaning products
          </Typography>
        </Box>

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!isLoading &&
          bestSellerProducts.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 5,
              }}
            >
              <Typography color="text.secondary">
                Best sellers will appear here soon.
              </Typography>
            </Box>
          )}

        {!isLoading &&
          bestSellerProducts.length > 0 && (
            <Grid
              container
              spacing={{
                xs: 2,
                sm: 3,
              }}
            >
              {bestSellerProducts.map(
                (product) => {
                  const offerZoneProduct =
                    offerZoneProductMap.get(
                      product.id
                    );

                  const promotionalSticker =
                    offerZoneProduct
                      ? offerZoneProduct.promotionalSticker
                      : stickerSettings
                          ?.promotionalSticker;

                  return (
                    <Grid
                      key={product.id}
                      size={{
                        xs: 6,
                        sm: 6,
                        md: 4,
                        lg: 2.4,
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
                          stickerSettings?.rotatingSticker
                        }
                        isOfferZoneProduct={
                          Boolean(
                            offerZoneProduct
                          )
                        }
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>
          )}

        {!isLoading &&
          bestSellerProducts.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: {
                  xs: 4,
                  md: 5,
                },
              }}
            >
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.3,
                  borderRadius: 1,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View All
              </Button>
            </Box>
          )}
      </Container>
    </Box>
  );
}