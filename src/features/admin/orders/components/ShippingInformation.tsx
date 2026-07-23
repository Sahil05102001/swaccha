import {
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

interface ShippingInformationProps {
  order: Order;
}

export default function ShippingInformation({
  order,
}: ShippingInformationProps) {
  const address = order.shippingAddress;

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Shipping Information
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
            Recipient Name
          </Typography>

          <Typography variant="body1">
            {address.fullName}
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
            Phone Number
          </Typography>

          <Typography variant="body1">
            {address.phoneNumber}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Address Line 1
          </Typography>

          <Typography variant="body1">
            {address.addressLine1}
          </Typography>
        </Grid>

        {address.addressLine2 && (
          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Address Line 2
            </Typography>

            <Typography variant="body1">
              {address.addressLine2}
            </Typography>
          </Grid>
        )}

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
            City
          </Typography>

          <Typography variant="body1">
            {address.city}
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
            State
          </Typography>

          <Typography variant="body1">
            {address.state}
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
            Postal Code
          </Typography>

          <Typography variant="body1">
            {address.postalCode}
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
            Country
          </Typography>

          <Typography variant="body1">
            {address.country}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}