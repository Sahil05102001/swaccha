import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  discount?: number;
  couponCode?: string;
  shippingNote?: string;
}

const COLORS = {
  white: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
  blueText: "#0891B2",
};

const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          color: strong ? COLORS.text : COLORS.muted,
          fontWeight: strong ? 700 : 400,
          fontSize: strong ? "1.1rem" : "0.95rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: strong ? COLORS.blueText : COLORS.text,
          fontWeight: strong ? 700 : 500,
          fontSize: strong ? "1.25rem" : "0.95rem",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function CheckoutSummary({
  subtotal,
  shipping,
  total,
  discount = 0,
  couponCode,
  shippingNote,
}: CheckoutSummaryProps) {
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderTop: `2px solid ${COLORS.blue}`,
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          "&:last-child": {
            pb: { xs: 2.5, md: 3 },
          },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            mb: 3,
            color: COLORS.text,
          }}
        >
          Order summary
        </Typography>

        <Stack spacing={2}>
          <Row
            label="Subtotal"
            value={formatPrice(subtotal)}
          />

          <Row
            label="Shipping"
            value={shipping === 0 ? "Free" : formatPrice(shipping)}
          />
          {shippingNote && (
            <Typography sx={{ mt: -1, fontSize: "0.78rem", color: COLORS.muted }}>
              {shippingNote}
            </Typography>
          )}

          {discount > 0 && (
            <Row
              label={couponCode ? `Discount (${couponCode})` : "Discount"}
              value={`-${formatPrice(discount)}`}
            />
          )}

          <Divider
            sx={{ borderColor: COLORS.border }}
          />

          <Row
            label="Total"
            value={formatPrice(total)}
            strong
          />
        </Stack>
      </CardContent>
    </Card>
  );
}