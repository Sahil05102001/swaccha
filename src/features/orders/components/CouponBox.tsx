import { useMemo, useState, type FormEvent } from "react";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

import { useAvailableCoupons } from "@/features/coupons/hooks/useCoupons";
import {
  previewCoupon,
  type AppliedCoupon,
  type CheckoutOffer,
} from "@/features/coupons/services/couponService";

interface CouponBoxProps {
  subtotal: number;
  paymentMethod: string;
  shipping: number;
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}

const COLORS = {
  white: "#FFFFFF",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
  blue: "#00D9FF",
  blueText: "#0891B2",
  error: "#D32F2F",
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function offerText(o: CheckoutOffer) {
  if (o.type === "freeShipping") return "Free delivery";
  if (o.type === "flat") return `${rupees(o.value)} off`;
  return `${o.value}% off${o.maxDiscount > 0 ? ` up to ${rupees(o.maxDiscount)}` : ""}`;
}

export default function CouponBox({
  subtotal,
  paymentMethod,
  shipping,
  applied,
  onApply,
  onRemove,
}: CouponBoxProps) {
  const method = paymentMethod === "cod" ? "cod" : "razorpay";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: offers = [] } = useAvailableCoupons(!applied);

  const reasonFor = (o: CheckoutOffer) => {
    if (o.type === "freeShipping" && shipping <= 0) return "Delivery is already free";
    if (o.paymentMethods === "online" && method !== "razorpay") return "Online payment only";
    if (o.paymentMethods === "cod" && method !== "cod") return "Cash on delivery only";
    if (subtotal < o.minOrderValue) return `Add ${rupees(o.minOrderValue - subtotal)} more`;
    return "";
  };

  // Usable offers first, then at most three are shown.
  const shown = useMemo(
    () =>
      offers
        .map((o) => ({ o, reason: reasonFor(o) }))
        .sort((a, b) => Number(!!a.reason) - Number(!!b.reason))
        .slice(0, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offers, subtotal, method, shipping],
  );

  const apply = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");

    try {
      onApply(
        await previewCoupon({
          code: trimmed,
          subtotal,
          paymentMethod: method,
          shipping,
        }),
      );
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not apply this coupon.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    apply(code);
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, "&:last-child": { pb: { xs: 2, md: 2.5 } } }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5, color: COLORS.text }}>
          Coupon
        </Typography>

        {applied ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, color: COLORS.blueText }}>
                {applied.code} applied
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: COLORS.muted }}>
                You saved {rupees(applied.discount)}
              </Typography>
            </Box>
            <Button
              disableRipple
              onClick={onRemove}
              sx={{ textTransform: "none", fontWeight: 600, color: COLORS.text, textDecoration: "underline" }}
            >
              Remove
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Box component="form" onSubmit={submit}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Enter coupon code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (error) setError("");
                  }}
                  error={!!error}
                  slotProps={{ htmlInput: { maxLength: 20, "aria-label": "Coupon code" } }}
                />
                <Button
                  type="submit"
                  disableRipple
                  disableElevation
                  variant="contained"
                  disabled={loading || !code.trim()}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    bgcolor: "#000",
                    color: "#fff",
                    "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
                    "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
                  }}
                >
                  {loading ? "..." : "Apply"}
                </Button>
              </Stack>
              {error && (
                <Typography sx={{ mt: 0.75, fontSize: "0.8rem", color: COLORS.error }}>
                  {error}
                </Typography>
              )}
            </Box>

            {shown.map(({ o, reason }) => (
              <Stack
                key={o.code}
                direction="row"
                spacing={1}
                sx={{
                  p: 1.25,
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: `1px dashed ${COLORS.border}`,
                  borderRadius: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: COLORS.text }}>
                    {o.code}
                    <Box component="span" sx={{ ml: 1, fontWeight: 500, color: COLORS.blueText }}>
                      {offerText(o)}
                    </Box>
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: COLORS.muted }}>
                    {reason || o.description}
                  </Typography>
                </Box>
                <Button
                  disableRipple
                  disabled={!!reason || loading}
                  onClick={() => apply(o.code)}
                  sx={{ textTransform: "none", fontWeight: 600, color: COLORS.text, flexShrink: 0 }}
                >
                  Apply
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}