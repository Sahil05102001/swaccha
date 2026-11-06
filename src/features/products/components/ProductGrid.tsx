import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ProductCard from "@/components/product/ProductCard";

import {
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";

import type { Product } from "../types/product";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  const {
    data: offerZoneProducts = [],
    isLoading: isOfferZoneLoading,
  } = useOfferZoneProducts();

  const {
    data: globalStickerSettings,
    isLoading: isStickerSettingsLoading,
  } = useGlobalProductStickerSettings();

  if (products.length === 0) {
    return (
      <Typography
        color="text.secondary"
        sx={{
          py: 4,
          textAlign: "center",
        }}
      >
        No products available.
      </Typography>
    );
  }

  const isLoading =
    isOfferZoneLoading ||
    isStickerSettingsLoading;

  if (isLoading) {
    return (
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
      >
        {products.map((product) => (
          <Grid
            key={product.id}
            size={{
              xs: 6,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Box
              sx={{
                minHeight: {
                  xs: 320,
                  sm: 390,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor:
                  "background.paper",
              }}
            >
              <Stack
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                <CircularProgress
                  size={30}
                  thickness={4}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Loading...
                </Typography>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  const offerZoneProductMap = new Map(
    offerZoneProducts.map(
      (offerZoneProduct) => [
        offerZoneProduct.productId,
        offerZoneProduct,
      ]
    )
  );

  return (
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 2.5,
        md: 3,
      }}
    >
      {products.map((product) => {
        const offerZoneProduct =
          offerZoneProductMap.get(product.id);

        const promotionalSticker =
          offerZoneProduct
            ? offerZoneProduct.promotionalSticker
            : globalStickerSettings?.promotionalSticker;

        const rotatingSticker =
          globalStickerSettings?.rotatingSticker;

        return (
          <Grid
            key={product.id}
            size={{
              xs: 6,
              sm: 6,
              md: 4,
              lg: 3,
            }}
            // Lets every card fill its grid cell and keeps cards in a row the same height.
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            {/* "compact" matches the card text size used in Best Sellers and New Arrivals. */}
            <ProductCard
              product={product}
              compact
              showProductStickers
              promotionalSticker={
                promotionalSticker
              }
              rotatingSticker={
                rotatingSticker
              }
              isOfferZoneProduct={Boolean(
                offerZoneProduct
              )}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
