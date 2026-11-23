import { Chip, Grid } from "@mui/material";

import type { Order } from "@/features/orders/types/order";

import OrderSection, { InfoField } from "./OrderSection";

function paymentColor(status: Order["paymentStatus"]) {
  if (status === "paid") return "success";
  if (status === "failed") return "error";
  if (status === "refunded" || status === "partially_refunded") return "info";
  return "warning";
}

const dateTime = (ts?: { toDate: () => Date }) =>
  ts ? ts.toDate().toLocaleString("en-IN") : "-";

export default function OrderInformation({ order }: { order: Order }) {
  const paymentType = order.paymentMethodType
    ? ` · ${String(order.paymentMethodType).toUpperCase()}`
    : "";

  return (
    <OrderSection title="Order information">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Order number">{order.orderNumber}</InfoField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Order date">{dateTime(order.createdAt)}</InfoField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Payment method">
            {order.paymentMethod.toUpperCase()}
            {paymentType}
          </InfoField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField label="Payment status">
            <Chip
              size="small"
              variant="outlined"
              label={order.paymentStatus.replace(/_/g, " ")}
              color={paymentColor(order.paymentStatus)}
              sx={{ mt: 0.5 }}
            />
          </InfoField>
        </Grid>

        {order.paymentId && (
          <Grid size={12}>
            <InfoField label="Payment ID">{order.paymentId}</InfoField>
          </Grid>
        )}

        {order.codCollectedAt && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField label="Cash collected on">
              {dateTime(order.codCollectedAt)}
            </InfoField>
          </Grid>
        )}

        {order.deliveredAt && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField label="Delivered on">
              {dateTime(order.deliveredAt)}
            </InfoField>
          </Grid>
        )}

        {order.invoiceNumber && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoField label="Invoice number">{order.invoiceNumber}</InfoField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoField label="Invoice date">
                {dateTime(order.invoiceDate)}
              </InfoField>
            </Grid>
          </>
        )}
      </Grid>
    </OrderSection>
  );
}