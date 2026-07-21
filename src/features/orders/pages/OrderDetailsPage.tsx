import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { useOrder } from "../hooks/useOrders";
import OrderStatusChip from "../components/OrderStatusChip";

export default function OrderDetailsPage() {
  const { id = "" } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useOrder(id);

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

  if (isError || !order) {
    return (
      <Stack
        sx={{
          p: 4,
        }}
      >
        <Alert severity="error">
          Failed to load order.
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
        Order Details
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <OrderStatusChip status={order.orderStatus} />

            <Typography>
              <strong>Order ID:</strong> #{order.id}
            </Typography>

            <Typography>
              <strong>Payment Method:</strong>{" "}
              {order.paymentMethod.toUpperCase()}
            </Typography>

            <Typography>
              <strong>Payment Status:</strong>{" "}
              {order.paymentStatus}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Delivery Address
          </Typography>

          <Typography>
            {order.shippingAddress.fullName}
          </Typography>

          <Typography>
            {order.shippingAddress.phoneNumber}
          </Typography>

          <Typography>
            {order.shippingAddress.addressLine1}
          </Typography>

          {order.shippingAddress.addressLine2 && (
            <Typography>
              {order.shippingAddress.addressLine2}
            </Typography>
          )}

          <Typography>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}
          </Typography>

          <Typography>
            {order.shippingAddress.postalCode}
          </Typography>

          <Typography>
            {order.shippingAddress.country}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ordered Items
          </Typography>

          <Stack spacing={2}>
            {order.items.map((item) => (
              <Stack key={item.productId} spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {item.name}
                </Typography>

                <Typography color="text.secondary">
                  ₹{item.price} × {item.quantity}
                </Typography>

                <Divider />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              <strong>Subtotal:</strong> ₹{order.subtotal}
            </Typography>

            <Typography>
              <strong>Shipping:</strong> ₹{order.shippingCharge}
            </Typography>

            <Divider />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Grand Total: ₹{order.totalAmount}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}