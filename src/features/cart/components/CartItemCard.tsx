import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import type { Product } from "@/features/products/types/product";
import { useAddToWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useSnackbar } from "@/contexts/SnackbarContext";

import type { CartItem } from "../types/cart";
import QuantityControl from "./QuantityControl";
import { useDeleteCart, useUpdateCart } from "../hooks/useCart";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

const COLORS = {
  white: "#FFFFFF",
  surface: "#F9FAFB",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
  danger: "#DC2626",
};

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const updateCart = useUpdateCart();
  const deleteCart = useDeleteCart();
  const addToWishlist = useAddToWishlist();
  const { showSnackbar } = useSnackbar();

  const [moving, setMoving] = useState(false);

  const handleIncrease = () => {
    updateCart.mutate({
      id: item.id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (item.quantity === 1) {
      deleteCart.mutate(item.id);
      return;
    }

    updateCart.mutate({
      id: item.id,
      quantity: item.quantity - 1,
    });
  };

  // Save to the wishlist first, then remove only this cart line.
  // If saving fails, the item stays in the cart.

  const handleMoveToWishlist = async () => {
    if (loading || moving) return;

    if (!user) {
      navigate("/login", {
        state: {
          from: "/cart",
        },
      });
      return;
    }

    setMoving(true);

    try {
      const result = await addToWishlist.mutateAsync({
        ...item.product,
        id: item.productId,
      } as Product);

      await deleteCart.mutateAsync(item.id);

      showSnackbar(
        result.added
          ? "Moved to your wishlist."
          : "Already in your wishlist. Removed from your cart.",
        result.added ? "success" : "warning",
      );
    } catch (error) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Could not move this item to your wishlist.",
        "error",
      );
    } finally {
      setMoving(false);
    }
  };


  const lineTotal = item.product.price * item.quantity;

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        gap: { xs: 1.5, sm: 2.5 },
        p: { xs: 1.5, sm: 2 },
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "12px",
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={item.product.images?.[0] || ""}
        alt={item.product.name}
        loading="lazy"
        sx={{
          flexShrink: 0,
          width: { xs: 88, sm: 128 },
          height: { xs: 88, sm: 128 },
          objectFit: "contain",
          borderRadius: 1.5,
          bgcolor: "#FFFFFF",
          border: `1px solid ${COLORS.border}`,
        }}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.3,
                color: COLORS.text,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {item.product.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                color: COLORS.muted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.product.brand}
            </Typography>
          </Box>

          <IconButton
            aria-label={`Remove ${item.product.name} from cart`}
            onClick={() => deleteCart.mutate(item.id)}
            disabled={deleteCart.isPending || moving}
            size="small"
            sx={{
              flexShrink: 0,
              color: COLORS.muted,
              "&:hover": {
                color: COLORS.danger,
                bgcolor: "transparent",
              },
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: 2,
            rowGap: 1,
          }}
        >
          <QuantityControl
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                color: "#0891B2",
                whiteSpace: "nowrap",
              }}
            >
              ₹{lineTotal.toLocaleString("en-IN")}
            </Typography>

            {item.product.mrp > item.product.price && (
              <Typography
                component="div"
                sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
              >
                <Box
                  component="span"
                  sx={{
                    color: COLORS.muted,
                    textDecoration: "line-through",
                    mr: 0.75,
                  }}
                >
                  ₹
                  {(item.product.mrp * item.quantity).toLocaleString(
                    "en-IN",
                  )}
                </Box>

                <Box
                  component="span"
                  sx={{ color: "#0891B2", fontWeight: 700 }}
                >
                  {Math.round(
                    ((item.product.mrp - item.product.price) /
                      item.product.mrp) *
                    100,
                  )}
                  % off
                </Box>
              </Typography>
            )}

            {item.quantity > 1 && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: COLORS.muted,
                  whiteSpace: "nowrap",
                }}
              >
                ₹{item.product.price.toLocaleString("en-IN")} each
              </Typography>
            )}
          </Box>
        </Stack>

        {item.product.stock <= 0 ? (
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.danger }}>
            Out of stock. Remove it to continue.
          </Typography>
        ) : item.quantity > item.product.stock ? (
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.danger }}>
            Only {item.product.stock} left. Please reduce the quantity.
          </Typography>
        ) : null}

        <Box>
          <Button
            size="small"
            disableRipple
            onClick={handleMoveToWishlist}
            disabled={loading || moving || deleteCart.isPending}
            startIcon={<FavoriteBorderIcon fontSize="small" />}
            sx={{
              px: 1.5,
              py: 0.4,
              borderRadius: 999,
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              color: COLORS.text,
              border: `1px solid ${COLORS.border}`,
              transition: "none",
              "&:hover": {
                borderColor: COLORS.text,
                bgcolor: "transparent",
              },
              "&:focus-visible": {
                outline: `2px solid ${COLORS.blue}`,
                outlineOffset: 2,
              },
              "&.Mui-disabled": {
                color: COLORS.muted,
                borderColor: COLORS.border,
              },
            }}
          >
            {moving ? "Moving..." : "Move to wishlist"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}