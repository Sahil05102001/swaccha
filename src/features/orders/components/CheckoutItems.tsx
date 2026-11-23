import { Box, Stack, Typography } from "@mui/material";

interface CheckoutItem {
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    mrp?: number;
    images?: string[];
  };
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  teal: "#007F89",
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CheckoutItems({ items }: { items: CheckoutItem[] }) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box
      component="section"
      sx={{
        p: { xs: 2, sm: 3 },
        border: `1px solid ${COLORS.border}`,
        borderTop: `2px solid ${COLORS.blue}`,
        borderRadius: "12px",
        bgcolor: COLORS.white,
      }}
    >
      <Typography
        component="h2"
        sx={{
          mb: { xs: 1.5, sm: 2 },
          fontWeight: 700,
          fontSize: { xs: "1.05rem", sm: "1.2rem" },
          letterSpacing: "-0.01em",
          color: COLORS.text,
        }}
      >
        Your items{" "}
        <Typography
          component="span"
          sx={{ fontSize: "0.9rem", fontWeight: 500, color: COLORS.muted }}
        >
          ({count})
        </Typography>
      </Typography>

      <Stack divider={<Box sx={{ borderTop: `1px solid ${COLORS.border}` }} />}>
        {items.map((item) => {
          const { product } = item;
          const hasDiscount = (product.mrp ?? 0) > product.price;

          return (
            <Stack
              key={item.productId}
              direction="row"
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{ py: 1.5, alignItems: "center", minWidth: 0 }}
            >
              <Box
                component="img"
                src={product.images?.[0]}
                alt=""
                loading="lazy"
                sx={{
                  width: { xs: 56, sm: 68 },
                  height: { xs: 56, sm: 68 },
                  flexShrink: 0,
                  objectFit: "contain",
                  bgcolor: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    color: COLORS.text,
                    lineHeight: 1.35,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.name}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: "0.8rem", color: COLORS.muted }}>
                  Qty {item.quantity} × {rupees(product.price)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "0.95rem", color: COLORS.text }}
                >
                  {rupees(product.price * item.quantity)}
                </Typography>
                {hasDiscount && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: COLORS.muted,
                      textDecoration: "line-through",
                    }}
                  >
                    {rupees((product.mrp ?? 0) * item.quantity)}
                  </Typography>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
