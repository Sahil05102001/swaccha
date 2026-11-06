import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Box,
  Collapse,
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

const DESCRIPTION_COLLAPSED_LINES = 4;

const COLORS = {
  blue: "#00DDEB",
  ink: "#111111",
  body: "#46555A",
  divider: "rgba(0, 221, 235, 0.5)",
};

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const addToCart = useAddToCart();

  const [descriptionExpanded, setDescriptionExpanded] =
    useState(false);

  const [descriptionNeedsToggle, setDescriptionNeedsToggle] =
    useState(false);

  // Height (in px) of exactly four lines of text, measured from the real line height.
  const [collapsedHeight, setCollapsedHeight] =
    useState(96);

  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const description =
    product.description?.trim() ?? "";

  const hasDescription = description.length > 0;

  useEffect(() => {
    const element = descriptionRef.current;

    if (!element || !hasDescription) {
      setDescriptionNeedsToggle(false);
      return;
    }

    const checkDescriptionHeight = () => {
      const computedStyle =
        window.getComputedStyle(element);

      const lineHeight =
        parseFloat(computedStyle.lineHeight);

      if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
        setDescriptionNeedsToggle(false);
        return;
      }

      const measuredCollapsedHeight =
        lineHeight * DESCRIPTION_COLLAPSED_LINES;

      setCollapsedHeight(measuredCollapsedHeight);

      setDescriptionNeedsToggle(
        element.scrollHeight > measuredCollapsedHeight + 1
      );
    };

    checkDescriptionHeight();

    const resizeObserver = new ResizeObserver(
      checkDescriptionHeight
    );

    resizeObserver.observe(element);

    window.addEventListener(
      "resize",
      checkDescriptionHeight
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        checkDescriptionHeight
      );
    };
  }, [description, hasDescription]);

  useEffect(() => {
    if (!descriptionNeedsToggle) {
      setDescriptionExpanded(false);
    }
  }, [descriptionNeedsToggle]);

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleAddToCart = () => {
    if (loading) return;

    if (!user) {
      navigate("/login", {
        state: {
          from: `/products/${product.id}`,
        },
      });
      return;
    }

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
        onSuccess: () => {
          console.log("Added successfully");
        },
        onError: (error) => {
          console.error("Add to cart failed:", error);
        },
      }
    );
  };


  const addToWishlist = useAddToWishlist();

  const [wishlistFeedback, setWishlistFeedback] = useState<{
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);

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


  const descriptionTextSx = {
    color: COLORS.body,
    lineHeight: 1.7,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  } as const;

  return (
    <Stack
      spacing={{
        xs: 2,
        sm: 2.5,
      }}
    >
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
          disabled={
            loading ||
            product.stock <= 0 ||
            addToCart.isPending
          }
          wishlistDisabled={loading || addToWishlist.isPending}
        />
      </Box>

      {/* Product description */}
      {hasDescription && (
        <>
          <Divider sx={{ borderColor: COLORS.divider }} />

          <Box
            sx={{
              p: {
                xs: 1.75,
                sm: 2.25,
              },
              borderRadius: "14px",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLORS.blue}`,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: COLORS.ink,
              }}
            >
              About this product
            </Typography>

            {/* Short description: natural height */}
            {!descriptionNeedsToggle && (
              <Typography
                ref={descriptionRef}
                variant="body2"
                sx={descriptionTextSx}
              >
                {description}
              </Typography>
            )}

            {/* Long description: collapsible */}
            {descriptionNeedsToggle && (
              <>
                <Collapse
                  in={descriptionExpanded}
                  collapsedSize={collapsedHeight}
                  timeout={220}
                >
                  <Typography
                    ref={descriptionRef}
                    variant="body2"
                    sx={descriptionTextSx}
                  >
                    {description}
                  </Typography>
                </Collapse>

                <Link
                  component="button"
                  type="button"
                  underline="always"
                  onClick={() =>
                    setDescriptionExpanded(
                      (current) => !current
                    )
                  }
                  sx={{
                    display: "inline-block",
                    mt: 1,
                    p: 0,
                    border: 0,
                    background: "none",
                    cursor: "pointer",

                    // Black text with an electric-blue underline (blue text alone is too faint on white).
                    color: COLORS.ink,
                    textDecorationColor: COLORS.blue,
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "4px",

                    fontSize: "0.875rem",
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
                  {descriptionExpanded
                    ? "Read less"
                    : "Read more"}
                </Link>
              </>
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
          >
            {wishlistFeedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
