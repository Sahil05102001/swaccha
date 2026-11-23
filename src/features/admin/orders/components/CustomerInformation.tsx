import { Grid } from "@mui/material";

import type { Order } from "@/features/orders/types/order";

import OrderSection, { InfoField } from "./OrderSection";

export default function CustomerInformation({ order }: { order: Order }) {
  return (
    <OrderSection title="Customer">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Name">{order.customerName}</InfoField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Phone">{order.shippingAddress.phoneNumber}</InfoField>
        </Grid>

        <Grid size={12}>
          <InfoField label="Email">{order.customerEmail}</InfoField>
        </Grid>

        <Grid size={12}>
          <InfoField label="User ID">{order.userId}</InfoField>
        </Grid>
      </Grid>
    </OrderSection>
  );
}