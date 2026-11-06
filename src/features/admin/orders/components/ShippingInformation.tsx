import {
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import type { Order } from "@/features/orders/types/order";

interface ShippingInformationProps {
  order: Order;
}

export default function ShippingInformation({
  order,
}: ShippingInformationProps) {
  const address = order.shippingAddress;

  const hasPin =
    typeof address.latitude === "number" &&
    typeof address.longitude === "number";

  const mapsUrl = hasPin
    ? `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`
    : "";

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

        {hasPin && (
          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Delivery Location
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 0.5, alignItems: { sm: "center" } }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<PlaceOutlinedIcon />}
                component="a"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ alignSelf: "flex-start" }}
              >
                Open in Google Maps
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {address.latitude!.toFixed(6)}, {address.longitude!.toFixed(6)}
                {typeof address.locationAccuracy === "number" &&
                  ` · GPS accuracy about ${address.locationAccuracy} m`}
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}