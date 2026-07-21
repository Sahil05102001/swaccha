import { Stack, Typography } from "@mui/material";

import type { Product } from "../types/product";

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({
  product,
}: ProductHeaderProps) {
  return (
    <Stack spacing={1}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700 }}
      >
        {product.name}
      </Typography>

      <Typography color="text.secondary">
        Brand: {product.brand}
      </Typography>

      <Typography color="text.secondary">
        SKU: {product.sku}
      </Typography>
    </Stack>
  );
}