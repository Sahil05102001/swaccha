import {
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

interface OrderInformationProps {
  order: Order;
}

export default function OrderInformation({
  order,
}: OrderInformationProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Order Information
      </Typography>

      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Order Number
          </Typography>

          <Typography variant="body1">
            {order.orderNumber}
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Order Date
          </Typography>

          <Typography variant="body1">
            {order.createdAt
              .toDate()
              .toLocaleString("en-IN")}
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Payment Method
          </Typography>

          <Typography
            sx={{
              textTransform: "uppercase",
            }}
          >
            {order.paymentMethod}
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "block",
            }}
          >
            Payment Status
          </Typography>

          <Chip
            size="small"
            label={order.paymentStatus}
            color={
              order.paymentStatus === "paid"
                ? "success"
                : order.paymentStatus ===
                  "failed"
                ? "error"
                : "warning"
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "block",
            }}
          >
            Order Status
          </Typography>

          <Chip
            size="small"
            label={order.orderStatus}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}