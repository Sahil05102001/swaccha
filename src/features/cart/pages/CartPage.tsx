import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { useCart } from "../hooks/useCart";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";
import EmptyCart from "../components/EmptyCart";

const COLORS = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
};

function PageShell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: COLORS.background,
        color: COLORS.text,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        py: { xs: 4, sm: 6, md: 8 },
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
  } = useCart();

  if (isLoading) {
    return (
      <PageShell center>
        <CircularProgress
          aria-label="Loading your cart"
          sx={{ color: COLORS.blue }}
        />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
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
      <PageShell>
        <EmptyCart />
      </PageShell>
    );
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const itemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
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
          mb: { xs: 3, md: 5 },
          pb: { xs: 2, md: 3 },
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
              xs: "1.75rem",
              sm: "2rem",
              md: "2.5rem",
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
            color: "#0891B2",
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

      {/* Cart content */}
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        sx={{ alignItems: "flex-start" }}
      >
        {/* Cart items */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </Stack>
        </Grid>

        {/* Order summary */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              position: { xs: "static", md: "sticky" },
              top: { md: 24 },
            }}
          >
            <OrderSummary subtotal={subtotal} />
          </Box>
        </Grid>
      </Grid>
    </PageShell>
  );
}