
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import { useMemo } from "react";

import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/features/products/hooks/useProducts";

import {
  useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";

export default function CustomerOfferZonePage() {
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

  const offerZoneProductCards = useMemo(() => {
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    return offerZoneProducts
      .map((offerItem) => {
        const product = productMap.get(offerItem.productId);

        if (!product || !product.isActive) {
          return null;
        }

        return {
          product,
          promotionalSticker: offerItem.promotionalSticker,
        };
      })
      .filter(
        (
          item,
        ): item is NonNullable<typeof item> => item !== null,
      );
  }, [products, offerZoneProducts]);

  const isLoading = isProductsLoading || isOfferZoneLoading;
  const hasError = isProductsError || isOfferZoneError;

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color: "text.primary",
            fontWeight: 700,
          }}
        >
          Offer Zone
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Explore special offers on selected Swachha products.
        </Typography>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!isLoading && hasError && (
        <Alert severity="error">
          We couldn't load the Offer Zone right now. Please try again later.
        </Alert>
      )}

      {!isLoading && !hasError && offerZoneProductCards.length === 0 && (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            sx={{ fontWeight: 600 }}
          >
            No offers available right now
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "text.secondary",
            }}
          >
            Please check back soon for special offers.
          </Typography>
        </Box>
      )}

      {!isLoading && !hasError && offerZoneProductCards.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            alignItems: "stretch",
          }}
        >
          {offerZoneProductCards.map(
            ({ product, promotionalSticker }) => (
              <Box key={product.id} sx={{ minWidth: 0 }}>
                <ProductCard
                  product={product}
                  isOfferZoneProduct
                  showProductStickers
                  promotionalSticker={promotionalSticker}
                  rotatingSticker={{
                    isEnabled: false,
                    texts: [],
                    intervalSeconds: 3,
                  }}
                />
              </Box>
            ),
          )}
        </Box>
      )}
    </Container>
  );
}
