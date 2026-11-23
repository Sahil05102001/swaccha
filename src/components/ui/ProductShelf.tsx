import type { ReactNode } from "react";


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


import type { Product } from "@/features/products/types/product";


interface ProductShelfProps {
  title: string;
  subtitle?: string;
  /** Shown under the heading, e.g. a countdown. */
  headerExtra?: ReactNode;
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  badge?: "new" | "bestseller" | "deal";
  background?: string;
  maxItems?: number;
  reserveHeader?: boolean;
}


export default function ProductShelf({
  title,
  subtitle,
  headerExtra,
  products,
  isLoading = false,
  isError = false,
  badge,
  background = "#F5F7FA",
  maxItems = 5,
  reserveHeader = false,
}: ProductShelfProps) {
  const {
    data: offerZoneProducts = [],
    isLoading: offerLoading,
  } = useOfferZoneProducts();


  const {
    data: stickerSettings,
    isLoading: stickerLoading,
  } = useGlobalProductStickerSettings();


  const loading = isLoading || offerLoading || stickerLoading;


  // Keeps the heading the same height before and after the data arrives.
  const showSubtitleSlot = Boolean(subtitle) || (loading && reserveHeader);
  const showExtraSlot = Boolean(headerExtra) || (loading && reserveHeader);


  const items = products.slice(0, maxItems);


  // Nothing to show: hide the whole section instead of an empty box.
  if (!loading && (isError || items.length === 0)) {
    return null;
  }


  const offerMap = new Map(
    offerZoneProducts.map((item) => [item.productId, item]),
  );


  const renderCard = (product: Product) => {
    const offer = offerMap.get(product.id);


    return (
      <ProductCard
        product={product}
        compact
        badge={badge}
        showProductStickers
        promotionalSticker={
          offer
            ? offer.promotionalSticker
            : stickerSettings?.promotionalSticker
        }
        rotatingSticker={stickerSettings?.rotatingSticker}
        isOfferZoneProduct={Boolean(offer)}
        globalBadgeText={stickerSettings?.globalBadge?.text}
      />
    );
  };


  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: background,
        py: { xs: 4.5, sm: 5.5, md: 6, lg: 6.5 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: 1400,
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
        }}
      >
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
            lineHeight: 1.05,
            letterSpacing: "-0.045em",
            mb:
              showSubtitleSlot || showExtraSlot
                ? 1.2
                : { xs: 3, sm: 3.5, md: 4 },
          }}
        >
          {title}
        </Typography>


        {showSubtitleSlot && (
          <Typography
            sx={{
              color: "#4B5563",
              textAlign: "center",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.5,
              minHeight: "1.5em",
              mb: showExtraSlot ? 1.5 : { xs: 3, sm: 3.5, md: 4 },
            }}
          >
            {subtitle || "\u00A0"}
          </Typography>
        )}


        {showExtraSlot && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: 32,
              mb: { xs: 3, sm: 3.5, md: 4 },
            }}
          >
            {headerExtra}
          </Box>
        )}


        {loading && (
          <>
            <Box
              sx={{
                minHeight: { xs: 320, sm: 390, md: 430 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={32} thickness={4} />
            </Box>


            {/* Same space the "View All" button takes once loaded. */}
            <Box
              sx={{
                mt: { xs: 4, sm: 4.5, md: 5 },
                height: { xs: 42, sm: 46 },
              }}
            />
          </>
        )}


        {!loading && (
          <>
            {/* Mobile / tablet carousel.
                Auto margins on the first and last card centre the row when
                it fits, and fall back to normal scrolling when it doesn't. */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                gap: { xs: 1.5, sm: 2 },
                pb: 1,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": { display: "none" },
                "& > :first-of-type": { ml: "auto" },
                "& > :last-of-type": { mr: "auto" },
              }}
            >
              {items.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    flex: { xs: "0 0 175px", sm: "0 0 220px" },
                    width: { xs: 175, sm: 220 },
                    minWidth: 0,
                  }}
                >
                  {renderCard(product)}
                </Box>
              ))}
            </Box>


            {/* Desktop: five columns wide, centred when fewer cards exist. */}
            <Box
              sx={{
                "--gap": { md: "16px", lg: "18px", xl: "20px" },
                display: { xs: "none", md: "flex" },
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
                width: "100%",
                gap: "var(--gap)",
              }}
            >
              {items.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    flex: "0 0 calc((100% - 4 * var(--gap)) / 5)",
                    minWidth: 0,
                    display: "flex",
                  }}
                >
                  {renderCard(product)}
                </Box>
              ))}
            </Box>


            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 4, sm: 4.5, md: 5 },
              }}
            >
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                sx={{
                  minWidth: { xs: 132, sm: 145 },
                  minHeight: { xs: 42, sm: 46 },
                  px: 3,
                  borderRadius: 999,
                  border: "1px solid #111111",
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "#111111",
                  fontSize: { xs: "0.72rem", sm: "0.76rem" },
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.25)",
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