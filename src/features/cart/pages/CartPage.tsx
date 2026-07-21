import {
  Alert,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useCart } from "../hooks/useCart";
import { Stack } from "@mui/material";
import CartItemCard from "../components/CartItemCard";
import Grid from "@mui/material/Grid";
import OrderSummary from "../components/OrderSummary";
import EmptyCart from "../components/EmptyCart";

export default function CartPage() {
  const {
    data: cartItems,
    isLoading,
    isError,
    error,
  } = useCart();

  if (isLoading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Something went wrong."
          }
        </Alert>
      </Container>
    );
  }

  const subtotal =
    cartItems?.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    ) ?? 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <EmptyCart />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4 }}
      >
        Shopping Cart
      </Typography>

      <Grid
        container
        spacing={4}
      >
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {cartItems?.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
              />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <OrderSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </Container>
  );
}