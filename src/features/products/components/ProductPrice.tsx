import { Stack, Typography } from "@mui/material";

interface ProductPriceProps {
  price: number;
  mrp: number;
  discount: number;
}

export default function ProductPrice({
  price,
  mrp,
  discount,
}: ProductPriceProps) {
  const savings = mrp - price;

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{
            fontWeight: 700,
          }}
        >
          ₹{price}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            textDecoration: "line-through",
          }}
        >
          ₹{mrp}
        </Typography>
      </Stack>

      <Typography color="success.main">
        Save ₹{savings} ({discount}% OFF)
      </Typography>
    </Stack>
  );
}