import { Button, Grid, Link, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import type { Order } from "@/features/orders/types/order";

import OrderSection, { InfoField } from "./OrderSection";

export default function ShippingInformation({ order }: { order: Order }) {
  const address = order.shippingAddress;

  const hasPin =
    typeof address.latitude === "number" &&
    typeof address.longitude === "number";

  const mapsUrl = hasPin
    ? `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`
    : "";

  return (
    <OrderSection title="Shipping address">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Recipient">{address.fullName}</InfoField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Phone">
            <Link href={`tel:${address.phoneNumber}`} underline="hover">
              {address.phoneNumber}
            </Link>
          </InfoField>
        </Grid>

        <Grid size={12}>
          <InfoField label="Address">
            {address.addressLine1}
            {address.addressLine2 && (
              <>
                <br />
                {address.addressLine2}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </InfoField>
        </Grid>

        {hasPin && (
          <Grid size={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ alignItems: { sm: "center" } }}
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

              <Typography variant="caption" color="text.secondary">
                {address.latitude!.toFixed(6)}, {address.longitude!.toFixed(6)}
                {typeof address.locationAccuracy === "number" &&
                  ` · GPS accuracy about ${address.locationAccuracy} m`}
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </OrderSection>
  );
}