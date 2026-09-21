import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";

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
  }, [
    rotatingSticker?.isEnabled,
    rotatingSticker?.intervalSeconds,
    rotatingStickerTexts.join("|"),
  ]);

  useEffect(() => {
    if (
      !showProductStickers ||
      !rotatingSticker?.isEnabled ||
      rotatingStickerTexts.length <= 1
    ) {
      return;
    }

    const intervalSeconds =
      rotatingSticker.intervalSeconds > 0
        ? rotatingSticker.intervalSeconds
        : 3;

    const intervalId = window.setInterval(() => {
      setRotatingStickerIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          rotatingStickerTexts.length
      );
    }, intervalSeconds * 1000);

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

  const handleAddToWishlist = () => {
    const {
      createdAt,
      updatedAt,
      ...serializableProduct
    } = product;

    dispatch(addToWishlist(serializableProduct));
  };

  const ratingAverage = product.ratingAverage ?? 0;
  const ratingCount = product.ratingCount ?? 0;

  const showPromotionalSticker =
    showProductStickers &&
    promotionalSticker?.isEnabled === true &&
    promotionalSticker.text.trim().length > 0;

  const showRotatingSticker =
    showProductStickers &&
    rotatingSticker?.isEnabled === true &&
    rotatingStickerTexts.length > 0;

  const currentRotatingSticker =
    rotatingStickerTexts.length > 0
      ? rotatingStickerTexts[
          rotatingStickerIndex %
            rotatingStickerTexts.length
        ]
      : "";

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleAddToWishlist();
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 3,
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
          <Box
            sx={{
              position: "relative",
            }}
          >
            <CardMedia
              component="img"
              image={product.images[0]}
              alt={product.name}
              sx={{
                height: compact ? 180 : 280,
                objectFit: "contain",
                p: compact ? 2 : 3,
                bgcolor: "#fafafa",
              }}
            />

            {isOfferZoneProduct && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: "error.main",
                  color: "error.contrastText",
                  fontSize: compact
                    ? "0.7rem"
                    : "0.8rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: 0.5,
                  boxShadow: 2,
                }}
              >
                OFFER ZONE
              </Box>
            )}

            {showPromotionalSticker && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  maxWidth: "70%",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: compact
                    ? "0.7rem"
                    : "0.8rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: "center",
                  boxShadow: 2,
                }}
              >
                {promotionalSticker.text}
              </Box>
            )}

            {showRotatingSticker && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  maxWidth: "55%",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  border: 1,
                  borderColor: "divider",
                  fontSize: compact
                    ? "0.65rem"
                    : "0.75rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: "center",
                  boxShadow: 2,
                  transition: "opacity 0.3s ease",
                }}
              >
                {currentRotatingSticker}
              </Box>
            )}
          </Box>

          <CardContent
            sx={{
              p: compact ? 2 : undefined,
            }}
          >
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

            <Typography
              variant={compact ? "subtitle1" : "h6"}
              sx={{
                fontWeight: 700,
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: compact ? 2 : undefined,
                WebkitBoxOrient: "vertical",
                overflow: compact ? "hidden" : undefined,
              }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: compact ? 1.5 : 2,
                display: "-webkit-box",
                WebkitLineClamp: compact ? 2 : undefined,
                WebkitBoxOrient: "vertical",
                overflow: compact ? "hidden" : undefined,
              }}
            >
              {product.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mb: compact ? 1.5 : 2,
              }}
            >
              <Rating
                value={ratingAverage}
                precision={0.5}
                size={compact ? "small" : "medium"}
                readOnly
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {ratingAverage.toFixed(1)} (
                {ratingCount})
              </Typography>
            </Box>

            <Typography
              variant={compact ? "h6" : "h5"}
              color="primary"
              sx={{
                fontWeight: 700,
                mb: compact ? 1.5 : 3,
              }}
            >
              ₹{product.price}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Box>

      <CardContent
        sx={{
          pt: 0,
          p: compact ? 2 : undefined,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          size={compact ? "small" : "medium"}
          startIcon={<ShoppingCartOutlinedIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={
            product.stock <= 0 ||
            addToCart.isPending
          }
        >
          {product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}