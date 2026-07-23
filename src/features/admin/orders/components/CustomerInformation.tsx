import {
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

interface CustomerInformationProps {
  order: Order;
}

export default function CustomerInformation({
  order,
}: CustomerInformationProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Customer Information
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
            Customer Name
          </Typography>

          <Typography variant="body1">
            {order.customerName}
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
            Customer Email
          </Typography>

          <Typography variant="body1">
            {order.customerEmail}
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            User ID
          </Typography>

          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-all",
            }}
          >
            {order.userId}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}