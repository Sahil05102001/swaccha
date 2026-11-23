import { Divider, Stack, Typography } from "@mui/material";

import type { Order } from "@/features/orders/types/order";

import OrderSection from "./OrderSection";

function SummaryRow({
  label,
  value,
  bold = false,
  muted = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  const weight = bold ? 700 : 400;

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}
    >
      <Typography
        variant="body2"
        color={muted ? "text.secondary" : "text.primary"}
        sx={{ fontWeight: weight }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color={muted ? "text.secondary" : "text.primary"}
        sx={{ fontWeight: weight, whiteSpace: "nowrap" }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const fromPaise = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function OrderSummaryCard({ order }: { order: Order }) {
  const tax = order.tax?.applied === true ? order.tax : null;

  return (
    <OrderSection title="Summary">
      <Stack spacing={1.5} sx={{ maxWidth: 420, ml: { sm: "auto" } }}>
        <SummaryRow label="Subtotal" value={rupees(order.subtotal)} />

        <SummaryRow
          label="Shipping charges"
          value={rupees(order.shippingCharge)}
        />

        {!!order.discount && (
          <SummaryRow
            label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
            value={`-${rupees(order.discount)}`}
          />
        )}

        <Divider />

        <SummaryRow
          label="Total amount"
          value={rupees(order.totalAmount)}
          bold
        />

        {tax && (
          <>
            <Divider />

            <Typography variant="caption" color="text.secondary">
              GST is already included in the total. Place of supply:{" "}
              {tax.placeOfSupply}.
            </Typography>

            <SummaryRow
              muted
              label="Taxable value"
              value={fromPaise(tax.taxablePaise)}
            />

            {tax.intraState ? (
              <>
                <SummaryRow muted label="CGST" value={fromPaise(tax.cgstPaise)} />
                <SummaryRow muted label="SGST" value={fromPaise(tax.sgstPaise)} />
              </>
            ) : (
              <SummaryRow muted label="IGST" value={fromPaise(tax.igstPaise)} />
            )}

            <SummaryRow
              muted
              label="Total GST"
              value={fromPaise(tax.totalTaxPaise)}
            />
          </>
        )}
      </Stack>
    </OrderSection>
  );
}