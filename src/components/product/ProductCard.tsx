import {
  Box,
  Button,
  Card,
  CardMedia,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { getRating } from "@/features/reviews/utils/rating";


import type {
  Product,
  ProductSticker,
  RotatingProductSticker,
} from "@/features/products/types/product";


import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useNavigate } from "react-router-dom";


interface ProductCardProps {
  product: Product;
  compact?: boolean;
  showProductStickers?: boolean;
  promotionalSticker?: ProductSticker;
  rotatingSticker?: RotatingProductSticker;
  isOfferZoneProduct?: boolean;
  /** Corner tag for the section the card is shown in. */
  badge?: "new" | "bestseller" | "deal";
  /** Text for products that use the global badge (needed outside the sections). */
  globalBadgeText?: string;
}


export default function ProductCard({
  product,
  compact = false,
  showProductStickers = false,
  promotionalSticker,
  rotatingSticker,
  isOfferZoneProduct = false,
  badge,
  globalBadgeText,
}: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();


  const { loading } = useAuth();


  const [rotatingStickerIndex, setRotatingStickerIndex] = useState(0);


  const rotatingStickerTexts =
    rotatingSticker?.texts?.filter((text) => text.trim().length > 0) ?? [];


  useEffect(() => {
    setRotatingStickerIndex(0);
  }, [rotatingStickerTexts.join("|")]);


  useEffect(() => {
    if (
      !showProductStickers ||
      !rotatingSticker?.isEnabled ||
      rotatingStickerTexts.length <= 1
    ) {
      return;
    }


    const intervalMs = Math.max(1, rotatingSticker.intervalSeconds) * 1000;


    const intervalId = window.setInterval(() => {
      setRotatingStickerIndex(
        (currentIndex) => (currentIndex + 1) % rotatingStickerTexts.length,
      );
    }, intervalMs);


    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    showProductStickers,
    rotatingSticker?.isEnabled,
    rotatingSticker?.intervalSeconds,
    rotatingStickerTexts.join("|"),
  ]);


  const handleAddToCart = () => {
    if (loading) {
      return;
    }


    if (product.stock <= 0) {
      return;
    }


    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      product,
    });
  };


  const shouldShowPromotionalSticker =
    showProductStickers &&
    promotionalSticker?.isEnabled &&
    promotionalSticker.text.trim().length > 0;


  const shouldShowRotatingSticker =
    showProductStickers &&
    rotatingSticker?.isEnabled &&
    rotatingStickerTexts.length > 0;


  const currentRotatingSticker =
    rotatingStickerTexts[
    rotatingStickerIndex % Math.max(1, rotatingStickerTexts.length)
    ];


  const productBadge =
    product.badgeMode === "custom"
      ? (product.badgeText ?? "").trim()
      : product.badgeMode === "global"
        ? (globalBadgeText ?? "").trim()
        : "";


  // Priority: Offer Zone, then the section tag, then the product's own badge.
  const cornerTag = isOfferZoneProduct
    ? "Offer Zone"
    : badge === "new"
      ? "New"
      : badge === "bestseller"
        ? "Bestseller"
        : badge === "deal"
          ? "Lightning Deal"
          : productBadge || null;


  const { average: ratingAverage, count: ratingCount } = getRating(product);


  const safePrice = Number.isFinite(product.price) ? product.price : 0;


  const safeMrp = Number.isFinite(product.mrp) ? product.mrp : 0;


  const hasDiscount = safeMrp > safePrice && safePrice > 0;


  const savings = hasDiscount ? safeMrp - safePrice : 0;


  const discountPercentage = hasDiscount
    ? Math.round((savings / safeMrp) * 100)
    : 0;


  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);


  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",


        display: "flex",
        flexDirection: "column",


        overflow: "hidden",


        borderRadius: {
          xs: "16px",
          sm: "18px",
        },


        border: "1px solid #00DDEB",


        backgroundColor: "#EAFBFE",


        boxShadow: "none",


        transform: "none !important",
        transition: "none !important",


        "&:hover": {
          transform: "none !important",
          boxShadow: "none !important",
        },
      }}
    >
      {/* =====================================================
          IMAGE AREA
      ===================================================== */}


      <Box
        sx={{
          position: "relative",
          width: "100%",


          // Was 1 / 0.98 (almost square). Shorter image = shorter card.
          aspectRatio: {
            xs: "1 / 0.82",
            sm: "1 / 0.88",
          },


          overflow: "hidden",


          backgroundColor: "#FFFFFF",


          transform: "none !important",
          transition: "none !important",
        }}
      >
        {/* Bestseller / Offer Zone / Product badge */}


        {cornerTag && (
          <Box
            sx={{
              position: "absolute",


              top: 0,
              right: 0,


              zIndex: 5,


              px: {
                xs: 0.9,
                sm: 1.65,
              },


              py: {
                xs: 0.5,
                sm: 0.8,
              },


              minWidth: {
                xs: 66,
                sm: 98,
              },


              maxWidth: "80%",


              textAlign: "center",


              borderRadius: {
                xs: "0 0 0 12px",
                sm: "0 0 0 15px",
              },


              backgroundColor: "#00DDEB",


              color: "#071207",


              boxShadow: "none",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "block",


                fontSize: {
                  xs: "0.64rem",
                  sm: "0.78rem",
                },


                fontWeight: 500,


                lineHeight: 1.1,


                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cornerTag}
            </Typography>
          </Box>
        )}


        {/* Product image */}


        <Box
          component="button"
          type="button"
          onClick={() => navigate(`/products/${product.id}`)}
          sx={{
            display: "block",


            width: "100%",
            height: "100%",


            padding: 0,
            margin: 0,


            border: 0,
            outline: "none",


            background: "transparent",


            cursor: "pointer",


            lineHeight: 0,


            transform: "none !important",


            transition: "none !important",


            "&:hover": {
              backgroundColor: "transparent",
              transform: "none !important",
            },


            "&:focus": {
              outline: "none",
              backgroundColor: "transparent",
              transform: "none !important",
            },


            "&:active": {
              transform: "none !important",
            },
          }}
        >
          <CardMedia
            component="img"
            image={product.images?.[0] || ""}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sx={{
              display: "block",


              width: "100%",
              height: "100%",


              // "contain" shows the whole product with no cropping.
              // Use "cover" instead if you prefer a full-bleed image that crops edges.
              objectFit: "contain",


              objectPosition: "center",


              padding: 0,


              backgroundColor: "#FFFFFF",


              transform: "none !important",


              transition: "none !important",
            }}
          />
        </Box>
      </Box>


      {/* =====================================================
          PRODUCT CONTENT
      ===================================================== */}


      <Box
        sx={{
          display: "flex",
          flexDirection: "column",


          flex: 1,


          px: {
            xs: 1,
            sm: 1.25,
          },


          pt: {
            xs: 1.1,
            sm: 1.3,
          },


          pb: {
            xs: 1,
            sm: 1.25,
          },


          backgroundColor: "#EAFBFE",
        }}
      >
        {/* ===================================================
            PRODUCT NAME
            3 lines on phones (the card is narrow), 2 lines on larger screens.
        =================================================== */}


        <Typography
          component="h3"
          sx={{
            color: "#111111",


            fontSize: {
              xs: compact ? "0.86rem" : "0.92rem",
              sm: compact ? "0.92rem" : "1rem",
            },


            fontWeight: 500,


            lineHeight: 1.2,


            letterSpacing: "-0.025em",


            display: "-webkit-box",


            WebkitBoxOrient: "vertical",


            WebkitLineClamp: {
              xs: 3,
              sm: 2,
            },


            overflow: "hidden",


            // Stops one very long word from being cut off at the card edge.
            overflowWrap: "anywhere",


            // Reserved height matches the line clamp so cards in a row stay aligned.
            minHeight: {
              xs: "3.6em",
              sm: "2.4em",
            },
          }}
        >
          {product.name}
        </Typography>


        {/* ===================================================
            BENEFIT STICKER
            On phones the text can wrap to 2 lines instead of being cut off.
            The height is reserved so the card doesn't jump while it rotates.
        =================================================== */}


        {shouldShowRotatingSticker && (
          <Box
            sx={{
              width: "100%",


              mt: {
                xs: 1,
                sm: 1.1,
              },


              px: {
                xs: 0.9,
                sm: 1.25,
              },


              py: {
                xs: 0.45,
                sm: 0.5,
              },


              display: "flex",
              alignItems: "center",
              justifyContent: "center",


              minHeight: {
                xs: 35,
                sm: "auto",
              },


              borderRadius: {
                xs: "14px",
                sm: 999,
              },


              backgroundColor: "#00DDEB",


              color: "#061006",


              textAlign: "center",


              overflow: "hidden",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: {
                  xs: "-webkit-box",
                  sm: "block",
                },


                WebkitBoxOrient: "vertical",


                WebkitLineClamp: {
                  xs: 2,
                  sm: 1,
                },


                minWidth: 0,
                maxWidth: "100%",


                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },


                fontWeight: 400,


                lineHeight: 1.15,


                whiteSpace: {
                  xs: "normal",
                  sm: "nowrap",
                },


                overflowWrap: "anywhere",


                overflow: "hidden",


                textOverflow: "ellipsis",
              }}
            >
              {currentRotatingSticker}
            </Typography>
          </Box>
        )}


        {/* ===================================================
            PROMOTIONAL STICKER
        =================================================== */}


        {shouldShowPromotionalSticker && (
          <Box
            sx={{
              alignSelf: "flex-start",


              maxWidth: "100%",


              mt: {
                xs: 0.7,
                sm: 0.8,
              },


              px: {
                xs: 0.9,
                sm: 1.15,
              },


              py: {
                xs: 0.45,
                sm: 0.5,
              },


              borderRadius: "6px",


              backgroundColor: "#111111",


              color: "#00DDEB",


              overflow: "hidden",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: {
                  xs: "-webkit-box",
                  sm: "block",
                },


                WebkitBoxOrient: "vertical",


                WebkitLineClamp: {
                  xs: 2,
                  sm: 1,
                },


                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },


                fontWeight: 500,


                lineHeight: 1.1,


                whiteSpace: {
                  xs: "normal",
                  sm: "nowrap",
                },


                overflowWrap: "anywhere",


                overflow: "hidden",


                textOverflow: "ellipsis",
              }}
            >
              {promotionalSticker.text}
            </Typography>
          </Box>
        )}


        {/* ===================================================
            RATING
            Smaller on phones, and wraps instead of clipping the review count.
        =================================================== */}


        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: 0.8,
            rowGap: 0.5,
            mt: { xs: 1, sm: 1.1 },
            // Same height with or without reviews, so cards in a row stay aligned.
            minHeight: { xs: 26, sm: 30 },
          }}
        >
          {ratingCount > 0 ? (
            <>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  flexShrink: 0,
                  gap: { xs: 0.3, sm: 0.45 },
                  px: { xs: 0.7, sm: 1.05 },
                  py: { xs: 0.45, sm: 0.52 },
                  borderRadius: 999,
                  border: "1px solid #00C9D8",
                  backgroundColor: "#F4FCFE",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: "#111111",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {ratingAverage.toFixed(1)}
                </Typography>


                <Rating
                  value={ratingAverage}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{
                    fontSize: { xs: "0.78rem", sm: "0.95rem" },
                    color: "#FFB000",
                    "& .MuiRating-iconEmpty": { color: "#D5E1E3" },
                  }}
                />
              </Box>


              <Typography
                component="span"
                sx={{
                  color: "#52656B",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  fontWeight: 400,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                ({ratingCount})
              </Typography>
            </>
          ) : (
            <Typography
              component="span"
              sx={{
                color: "#52656B",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                lineHeight: 1,
              }}
            >
              No reviews yet
            </Typography>
          )}
        </Stack>


        {/* ===================================================
            PRICE
        =================================================== */}


        <Box
          sx={{
            mt: {
              xs: 0.9,
              sm: 1,
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",


              flexWrap: "wrap",


              columnGap: {
                xs: 0.75,
                sm: 1,
              },


              rowGap: 0.5,
            }}
          >
            {/* Selling price */}


            <Typography
              sx={{
                color: "#111111",


                fontSize: {
                  xs: "1.05rem",
                  sm: "1.15rem",
                },


                fontWeight: 700,


                lineHeight: 1,


                letterSpacing: "-0.025em",
              }}
            >
              ₹{formatPrice(safePrice)}
            </Typography>


            {/* MRP */}


            {hasDiscount && (
              <Typography
                component="span"
                sx={{
                  color: "#52656B",


                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.9rem",
                  },


                  fontWeight: 600,


                  lineHeight: 1,


                  textDecoration: "line-through",
                }}
              >
                ₹{formatPrice(safeMrp)}
              </Typography>
            )}


            {/* Save */}


            {hasDiscount && (
              <Box
                sx={{
                  px: 0.65,


                  py: 0.45,


                  borderRadius: "3px",


                  backgroundColor: "#111111",


                  color: "#FFFFFF",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: "block",


                    fontSize: {
                      xs: "0.62rem",
                      sm: "0.66rem",
                    },


                    fontWeight: 700,


                    lineHeight: 1,


                    whiteSpace: "nowrap",
                  }}
                >
                  SAVE {discountPercentage}%
                </Typography>
              </Box>
            )}
          </Stack>


          {/* Tax information */}


          <Typography
            component="div"
            sx={{
              mt: 0.65,


              color: "#52656B",


              fontSize: {
                xs: "0.68rem",
                sm: "0.72rem",
              },


              fontWeight: 400,


              lineHeight: 1.2,
            }}
          >
            MRP incl. of all taxes
          </Typography>
        </Box>


        {/* ===================================================
            ADD TO CART
        =================================================== */}


        <Box
          sx={{
            // Pushes the button to the bottom so all buttons line up.
            marginTop: "auto",


            // Minimum gap between the price block and the button.
            pt: {
              xs: 0.9,
              sm: 1,
            },
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={handleAddToCart}
            disabled={
              loading ||
              product.stock <= 0 ||
              addToCart.isPending
            }
            sx={{
              minHeight: {
                xs: 40,
                sm: 44,
              },


              borderRadius: 999,


              border: "1.5px solid #111111",


              backgroundColor: "#00DDEB",


              color: "#000000",


              fontSize: {
                xs: "0.88rem",
                sm: "0.95rem",
              },


              fontWeight: 400,


              letterSpacing: "-0.01em",


              textTransform: "none",


              boxShadow: "none",


              "&:hover": {
                backgroundColor: "#00DDEB",


                borderColor: "#111111",


                boxShadow: "none",


                transform: "none !important",
              },


              "&:active": {
                backgroundColor: "#00DDEB",


                borderColor: "#111111",


                transform: "none !important",
              },


              "&.Mui-disabled": {
                backgroundColor: "#D8EEF0",


                borderColor: "#7A9295",


                color: "#52656B",
              },
            }}
          >
            {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}