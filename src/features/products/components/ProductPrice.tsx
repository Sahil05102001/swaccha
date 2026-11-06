import { Box, Stack, Typography } from "@mui/material";

interface ProductPriceProps {
  price: number;
  mrp: number;
  discount: number;
}

const COLORS = {
  ink: "#111111",
  muted: "#68777A",
};

export default function ProductPrice({
  price,
  mrp,
}: ProductPriceProps) {
  const safePrice = Number.isFinite(price) ? price : 0;
  const safeMrp = Number.isFinite(mrp) ? mrp : 0;

  const hasValidPricing =
    safePrice > 0 && safeMrp > 0;

  const hasDiscount =
    hasValidPricing && safeMrp > safePrice;

  const savings = hasDiscount
    ? safeMrp - safePrice
    : 0;

  const discountPercentage = hasDiscount
    ? Math.round((savings / safeMrp) * 100)
    : 0;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Stack spacing={0.75}>
      {/* Main pricing */}
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: {
            xs: 1.25,
            sm: 1.5,
          },
          rowGap: 0.75,
        }}
      >
        {/* Selling price */}
        <Typography
          component="p"
          sx={{
            color: COLORS.ink,
            fontWeight: 800,
            fontSize: {
              xs: "1.6rem",
              sm: "1.9rem",
            },
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
          }}
        >
          ₹{formatPrice(safePrice)}
        </Typography>

        {/* MRP */}
        {hasDiscount && (
          <Typography
            component="span"
            sx={{
              color: COLORS.muted,
              textDecoration: "line-through",
              fontWeight: 600,
              fontSize: {
                xs: "0.95rem",
                sm: "1.05rem",
              },
              lineHeight: 1.4,
            }}
          >
            ₹{formatPrice(safeMrp)}
          </Typography>
        )}

        {/* Save badge (same style as the product card) */}
        {hasDiscount && (
          <Box
            sx={{
              px: 0.9,
              py: 0.55,
              borderRadius: "4px",
              backgroundColor: COLORS.ink,
              color: "#FFFFFF",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                },
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              SAVE {discountPercentage}%
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Savings */}
      {hasDiscount && (
        <Typography
          sx={{
            color: COLORS.ink,
            fontWeight: 600,
            fontSize: {
              xs: "0.85rem",
              sm: "0.9rem",
            },
            lineHeight: 1.5,
          }}
        >
          You save ₹{formatPrice(savings)}
        </Typography>
      )}

      {/* Tax note */}
      <Typography
        sx={{
          color: COLORS.muted,
          fontSize: {
            xs: "0.75rem",
            sm: "0.8rem",
          },
          lineHeight: 1.3,
        }}
      >
        MRP incl. of all taxes
      </Typography>
    </Stack>
  );
}
