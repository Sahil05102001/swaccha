import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppButton from "@/components/ui/AppButton";
import { ROUTES } from "@/constants/routes";

interface OrderSummaryProps {
  subtotal: number;
  savings?: number;
  itemCount?: number;
}

const COLORS = {
  white: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
  blueText: "#0891B2",
  black: "#000000",
};

const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

function Row({
  label,
  value,
  strong = false,
  accent = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
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
          fontSize: strong ? "1.05rem" : "0.92rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: strong || accent ? COLORS.blueText : COLORS.text,
          fontWeight: strong ? 700 : 500,
          fontSize: strong ? "1.25rem" : "0.92rem",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function OrderSummary({
  subtotal,
  savings = 0,
  itemCount,
}: OrderSummaryProps) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderTop: `2px solid ${COLORS.blue}`,
        borderRadius: "12px",
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          "&:last-child": {
            pb: { xs: 2, md: 2.5 },
          },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: "1.15rem",
            mb: 2,
            color: COLORS.text,
          }}
        >
          Order summary
        </Typography>

        <Stack spacing={1.5}>
          <Row
            label={
              itemCount
                ? `Subtotal (${itemCount} ${
                    itemCount === 1 ? "item" : "items"
                  })`
                : "Subtotal"
            }
            value={formatPrice(subtotal)}
          />

          {savings > 0 && (
            <Row
              label="You save"
              value={formatPrice(savings)}
              accent
            />
          )}

          <Row
            label="Delivery"
            value="Calculated at checkout"
          />

          <Divider sx={{ borderColor: COLORS.border }} />

          <Row
            label="Estimated total"
            value={formatPrice(subtotal)}
            strong
          />

          <Typography
            sx={{ fontSize: "0.78rem", color: COLORS.muted }}
          >
            Delivery charges and coupons are applied at checkout.
          </Typography>

          <AppButton
            fullWidth
            size="large"
            onClick={handleCheckout}
            sx={{
              mt: 0.5,
              minHeight: 54,
              px: 2,
              py: 1,
              borderRadius: "999px",
              bgcolor: COLORS.black,
              color: COLORS.white,
              boxShadow: "none",
              "&:hover": {
                bgcolor: COLORS.black,
                boxShadow: "none",
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
                fontWeight: 800,
                letterSpacing: "0.03em",
                color: COLORS.white,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              PROCEED TO CHECKOUT
            </Typography>
          </AppButton>
        </Stack>
      </CardContent>
    </Card>
  );
}