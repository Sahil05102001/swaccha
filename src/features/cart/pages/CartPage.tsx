import { useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import ProductCoupons from "@/features/products/components/ProductCoupons";
import ExclusiveOffers from "@/features/products/components/ExclusiveOffers";
import RandomProducts from "@/features/products/components/RandomProducts";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";
import EmptyCart from "../components/EmptyCart";
import { useLiveCart } from "../hooks/useLiveCart";
import { warmBackend } from "@/lib/backendWarmup";

const COLORS = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
  blueText: "#0891B2",
};

function PageShell({
  children,
  center = false,
  grow = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  /** Fill the screen height (used for the loading spinner only). */
  grow?: boolean;
}) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: COLORS.background,
        color: COLORS.text,
        minHeight: grow ? "100vh" : "auto",
        width: "100%",
        overflowX: "hidden",
        pt: { xs: 3, sm: 5, md: 6 },
        pb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          ...(center && {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }),
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default function CartPage() {
  const {
    data: cartItems,
    isLoading,
    isError,
    error,
  } = useLiveCart();

  useEffect(() => {
    warmBackend();
  }, []);

  if (isLoading) {
    return (
      <PageShell center grow>
        <CircularProgress
          aria-label="Loading your cart"
          sx={{ color: COLORS.blue }}
        />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell grow>
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            color: COLORS.text,
            borderColor: "#D64545",
            bgcolor: COLORS.surface,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              color: "#D64545",
            },
            wordBreak: "break-word",
          }}
        >
          {error instanceof Error
            ? error.message
            : "Something went wrong."}
        </Alert>
      </PageShell>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <PageShell>
          <EmptyCart />
        </PageShell>

        <RandomProducts title="Recommended for you" />
      </>
    );
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const savings = cartItems.reduce(
    (total, item) =>
      total +
      Math.max(0, (item.product.mrp ?? 0) - item.product.price) *
      item.quantity,
    0,
  );

  const itemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartProductIds = cartItems.map((item) => item.productId);

  return (
    <>
      <PageShell>
        {/* Cart header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            columnGap: 2,
            rowGap: 0.5,
            mb: { xs: 2.5, md: 4 },
            pb: { xs: 1.5, md: 2.5 },
            borderBottom: `1px solid ${COLORS.border}`,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: -1,
              width: { xs: 48, md: 72 },
              height: 2,
              bgcolor: COLORS.blue,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.6rem",
                sm: "1.9rem",
                md: "2.3rem",
              },
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: COLORS.text,
            }}
          >
            Shopping cart
          </Typography>

          <Typography
            sx={{
              color: COLORS.blueText,
              fontSize: {
                xs: "0.875rem",
                md: "1rem",
              },
              fontWeight: 600,
            }}
          >
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Typography>
        </Box>

        {/* Items and order summary */}
        <Grid
          container
          spacing={{ xs: 2.5, md: 4 }}
          sx={{ alignItems: "flex-start" }}
        >
          <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </Stack>

            <MuiLink
              component={Link}
              to="/products"
              underline="always"
              sx={{
                display: "inline-block",
                mt: 2,
                color: COLORS.text,
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecorationColor: COLORS.blue,
                textDecorationThickness: "2px",
                textUnderlineOffset: "4px",
              }}
            >
              ← Continue shopping
            </MuiLink>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                top: { md: 24 },
              }}
            >
              <OrderSummary
                subtotal={subtotal}
                savings={savings}
                itemCount={itemCount}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Coupons and exclusive offers (same sections as the product page) */}
        <Box sx={{ mt: { xs: 1.5, md: 2.5 } }}>
          <ProductCoupons />
          <ExclusiveOffers />
        </Box>
      </PageShell>

      {/* Five random products, different every time the cart opens */}
      <RandomProducts
        title="Recommended for you"
        excludeProductIds={cartProductIds}
      />
    </>
  );
}