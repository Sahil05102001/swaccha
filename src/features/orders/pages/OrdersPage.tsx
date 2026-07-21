import {
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import OrderCard from "../components/OrderCard";
import { useOrders } from "../hooks/useOrders";

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrders();

  if (isLoading) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack
        sx={{
          py: 4,
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Alert severity="error">
          Failed to load your orders.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={3}
      sx={{
        py: 4,
        px: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Alert severity="info">
          You haven't placed any orders yet.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}