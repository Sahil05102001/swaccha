import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Divider,
  Link,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

import type { Product } from "../types/product";

import ProductHeader from "./ProductHeader";
import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductActions from "./ProductActions";
import { useAddToWishlist } from "@/features/wishlist/hooks/useWishlist";

import { useAddToCart } from "@/features/cart/hooks/useCart";

interface ProductInfoProps {
  product: Product;
}

// Lines of description shown before "Read more".
const DESCRIPTION_COLLAPSED_LINES = 3;

const COLORS = {
  blue: "#00DDEB",
  ink: "#111111",
  body: "#46555A",
  divider: "rgba(0, 221, 235, 0.5)",
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [expanded, setExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);

  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const description = product.description?.trim() ?? "";
  const hasDescription = description.length > 0;

  // The text is clamped to a few lines. If it is taller than the clamped box,
  // the text is longer than what is shown, so "Read more" is needed.
  useEffect(() => {
    const element = descriptionRef.current;

    if (!element || !hasDescription) {
      setCanToggle(false);
      return;
    }

    const check = () => {
      // While expanded nothing is clamped, so keep the current answer.
      if (expanded) return;

      setCanToggle(element.scrollHeight > element.clientHeight + 1);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(element);

    return () => observer.disconnect();
  }, [description, hasDescription, expanded]);

  // A different product starts collapsed.
  useEffect(() => {
    setExpanded(false);
  }, [product.id]);

  const [wishlistFeedback, setWishlistFeedback] = useState<{
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);

  const handleAddToCart = () => {
    if (loading) return;

    if (product.stock <= 0 || addToCart.isPending) {
      return;
    }

    addToCart.mutate(
      {
        productId: product.id,
        quantity: 1,
        product,
      },
      {
        onError: (error) => {
          console.error("Add to cart failed:", error);
        },
      },
    );
  };

  const handleAddToWishlist = () => {
    if (loading || addToWishlist.isPending) return;

    if (!user) {
      navigate("/login", {
        state: {
          from: `/products/${product.id}`,
        },
      });
      return;
    }

    addToWishlist.mutate(product, {
      onSuccess: ({ added }) => {
        setWishlistFeedback({
          message: added
            ? "Product added to wishlist."
            : "Product already in your wishlist.",
          severity: added ? "success" : "info",
        });
      },
      onError: (error) => {
        console.error("Add to wishlist failed:", error);

        setWishlistFeedback({
          message: "Unable to update your wishlist. Please try again.",
          severity: "error",
        });
      },
    });
  };

  return (
    <Stack spacing={{ xs: 2, sm: 2.5 }}>
      {/* Product identity */}
      <Box>
        <ProductHeader product={product} />
      </Box>

      <Divider sx={{ borderColor: COLORS.divider }} />

      {/* Pricing */}
      <Box>
        <ProductPrice
          price={product.price}
          mrp={product.mrp}
          discount={product.discount}
        />
      </Box>

      {/* Availability */}
      <Box>
        <ProductStock stock={product.stock} />
      </Box>

      {/* Actions: kept above the description so the buy button is always easy to reach */}
      <Box>
        <ProductActions
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          disabled={loading || product.stock <= 0 || addToCart.isPending}
          wishlistDisabled={loading || addToWishlist.isPending}
        />
      </Box>

      {/* Product description */}
      {hasDescription && (
        <>
          <Divider sx={{ borderColor: COLORS.divider }} />

          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLORS.blue}`,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.5,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: COLORS.ink,
              }}
            >
              About this product
            </Typography>

            <Typography
              ref={descriptionRef}
              variant="body2"
              sx={{
                color: COLORS.body,
                lineHeight: 1.6,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                whiteSpace: "pre-line",

                ...(expanded
                  ? {}
                  : {
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: DESCRIPTION_COLLAPSED_LINES,
                      overflow: "hidden",
                    }),
              }}
            >
              {description}
            </Typography>

            {canToggle && (
              <Link
                component="button"
                type="button"
                underline="always"
                onClick={() => setExpanded((current) => !current)}
                sx={{
                  display: "inline-block",
                  mt: 0.75,
                  p: 0,
                  border: 0,
                  background: "none",
                  cursor: "pointer",

                  // Black text with an electric-blue underline.
                  color: COLORS.ink,
                  textDecorationColor: COLORS.blue,
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "4px",

                  fontSize: "0.85rem",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  textAlign: "left",

                  "&:hover": {
                    color: COLORS.ink,
                    textDecorationColor: COLORS.ink,
                  },

                  "&:focus-visible": {
                    outline: `2px solid ${COLORS.blue}`,
                    outlineOffset: 3,
                    borderRadius: "4px",
                  },
                }}
              >
                {expanded ? "Read less" : "Read more"}
              </Link>
            )}
          </Box>
        </>
      )}

      <Snackbar
        open={Boolean(wishlistFeedback)}
        autoHideDuration={3000}
        onClose={() => setWishlistFeedback(null)}
      >
        {wishlistFeedback ? (
          <Alert
            severity={wishlistFeedback.severity}
            onClose={() => setWishlistFeedback(null)}
            variant="filled"
            sx={{
              // Black with cyan text instead of the default green / blue.
              ...(wishlistFeedback.severity !== "error" && {
                backgroundColor: "#111111",
                color: COLORS.blue,
                "& .MuiAlert-icon": { color: COLORS.blue },
              }),
            }}
          >
            {wishlistFeedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}