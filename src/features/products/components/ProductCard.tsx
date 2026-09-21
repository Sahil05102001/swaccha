import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import type {
  Product,
  ProductSticker,
  RotatingProductSticker,
} from "@/features/products/types/product";

import { useAppDispatch } from "@/app/hooks";
import { addToWishlist } from "@/features/wishlist/wishlistSlice";

import { useAddToCart } from "@/features/cart/hooks/useCart";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  showProductStickers?: boolean;
  promotionalSticker?: ProductSticker;
  rotatingSticker?: RotatingProductSticker;
  isOfferZoneProduct?: boolean;
}

export default function ProductCard({
  product,
  compact = false,
  showProductStickers = false,
  promotionalSticker,
  rotatingSticker,
  isOfferZoneProduct = false,
}: ProductCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const addToCart = useAddToCart();

  const [rotatingStickerIndex, setRotatingStickerIndex] =
    useState(0);

  const rotatingStickerTexts =
    rotatingSticker?.texts?.filter(
      (text) => text.trim().length > 0
    ) ?? [];

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

    const intervalMs =
      Math.max(
        1,
        rotatingSticker.intervalSeconds
      ) * 1000;

    const intervalId = window.setInterval(() => {
      setRotatingStickerIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          rotatingStickerTexts.length
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
      rotatingStickerIndex %
        Math.max(1, rotatingStickerTexts.length)
    ];

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",

        ...(compact
          ? {}
          : {
              transition: "all 0.3s ease",

              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 8,
              },
            }),
      }}
    >
      <Box
        sx={{
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Wishlist */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addToWishlist(product));
          }}
          sx={{
            position: "absolute",
            top: compact ? 8 : 12,
            right: compact ? 8 : 12,
            zIndex: 4,
            bgcolor: "white",

            "&:hover": {
              bgcolor: "white",
            },
          }}
        >
          <FavoriteBorderIcon color="error" />
        </IconButton>

        <CardActionArea
          onClick={() =>
            navigate(`/products/${product.id}`)
          }
        >
          {/* Product Image */}
          <CardMedia
            component="img"
            image={product.images?.[0] || ""}
            alt={product.name}
            sx={{
              width: "100%",
              height: compact ? 180 : 280,
              objectFit: "contain",
              p: compact ? 1.5 : 3,
              bgcolor: "#fafafa",
            }}
          />

          <CardContent
            sx={{
              p: compact ? 1.5 : 2,
              "&:last-child": {
                pb: compact ? 1.5 : 2,
              },
            }}
          >
            {/* Featured Badge */}
            {product.isFeatured && (
              <Chip
                label="Featured"
                color="success"
                size="small"
                sx={{
                  mb: compact ? 1 : 2,
                }}
              />
            )}

            {/* Offer Zone Badge */}
            {isOfferZoneProduct && (
              <Chip
                label="OFFER ZONE"
                color="error"
                size="small"
                sx={{
                  mb: compact ? 1 : 2,
                  ml: product.isFeatured
                    ? 1
                    : 0,
                  fontWeight: 700,
                }}
              />
            )}

            {/* Product Name */}
            <Typography
              variant={
                compact ? "subtitle1" : "h6"
              }
              sx={{
                fontWeight: 700,
                mb: 1,

                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: compact ? 2 : 3,
                overflow: "hidden",

                ...(compact && {
                  minHeight: "48px",
                }),
              }}
            >
              {product.name}
            </Typography>

            {/* Description */}
            {product.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: compact ? 1 : 2,

                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: compact ? 2 : 3,
                  overflow: "hidden",

                  ...(compact && {
                    minHeight: "40px",
                  }),
                }}
              >
                {product.description}
              </Typography>
            )}

            {/* Price */}
            <Typography
              variant={
                compact ? "h6" : "h5"
              }
              color="primary"
              sx={{
                fontWeight: 700,
                mb: compact ? 0 : 3,
              }}
            >
              ₹{product.price}
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* Promotional Sticker */}
        {shouldShowPromotionalSticker && (
          <Box
            sx={{
              position: "absolute",
              top: compact ? 8 : 12,
              left: compact ? 8 : 12,
              zIndex: 3,
              maxWidth: {
                xs: "65%",
                sm: "70%",
              },
              px: compact ? 1 : 1.5,
              py: compact ? 0.5 : 0.75,
              borderRadius: 1.5,
              bgcolor: "error.main",
              color: "error.contrastText",
              boxShadow: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 800,
                lineHeight: 1.2,
                textTransform: "uppercase",
                wordBreak: "break-word",
              }}
            >
              {promotionalSticker.text}
            </Typography>
          </Box>
        )}

        {/* Rotating Sticker */}
        {shouldShowRotatingSticker && (
          <Box
            sx={{
              position: "absolute",
              left: compact ? 8 : 12,
              bottom: compact ? 8 : 12,
              zIndex: 3,
              maxWidth: "70%",
              px: compact ? 1 : 1.5,
              py: compact ? 0.5 : 0.75,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              boxShadow: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 700,
                lineHeight: 1.2,
                textTransform: "uppercase",
                wordBreak: "break-word",
              }}
            >
              {currentRotatingSticker}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add To Cart */}
      <CardContent
        sx={{
          mt: "auto",
          pt: 0,
          px: compact ? 1.5 : 2,
          pb: compact ? 1.5 : 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={
            <ShoppingCartOutlinedIcon />
          }
          onClick={handleAddToCart}
          disabled={
            product.stock <= 0 ||
            addToCart.isPending
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}