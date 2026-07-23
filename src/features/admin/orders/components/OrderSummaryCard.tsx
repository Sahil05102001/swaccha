import {
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

interface OrderSummaryCardProps {
  order: Order;
}

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function SummaryRow({
  label,
  value,
  bold = false,
}: SummaryRowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant={bold ? "subtitle1" : "body1"}
        sx={{
          fontWeight: bold ? 700 : 400,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant={bold ? "subtitle1" : "body1"}
        sx={{
          fontWeight: bold ? 700 : 400,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function OrderSummaryCard({
  order,
}: OrderSummaryCardProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Order Summary
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <SummaryRow
            label="Subtotal"
            value={`₹${order.subtotal.toLocaleString("en-IN")}`}
          />

          <SummaryRow
            label="Shipping Charges"
            value={`₹${order.shippingCharge.toLocaleString("en-IN")}`}
          />

          <Divider />

          <SummaryRow
            label="Total Amount"
            value={`₹${order.totalAmount.toLocaleString("en-IN")}`}
            bold
          />
        </Stack>
      </Paper>
    </Stack>
  );
}