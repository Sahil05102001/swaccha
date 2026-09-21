import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ProductCard from "@/components/product/ProductCard";
import {
  useGlobalProductStickerSettings,
  useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function FeaturedProducts() {
  const navigate = useNavigate();

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
        product.isFeatured && product.isActive
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
    ])
  );

  return (
    <Box
      sx={{
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
          }}
        >
          Featured Products
        </Typography>

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Typography
            align="center"
            color="error"
          >
            Unable to load featured products.
          </Typography>
        )}

        {!isLoading &&
          !isError &&
          featuredProducts.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
            >
              No featured products available.
            </Typography>
          )}

        {!isLoading &&
          !isError &&
          featuredProducts.length > 0 && (
            <>
              <Grid
                container
                spacing={{ xs: 2, md: 2 }}
                sx={{
                  alignItems: "stretch",
                }}
              >
                {featuredProducts.map((product) => {
                  const offerZoneProduct =
                    offerZoneProductMap.get(
                      product.id
                    );

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
                        xs: 12,
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
                          rotatingSticker
                        }
                        isOfferZoneProduct={
                          Boolean(
                            offerZoneProduct
                          )
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 6,
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    navigate("/products")
                  }
                  sx={{
                    minWidth: 160,
                    borderRadius: 999,
                    px: 4,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 600,
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