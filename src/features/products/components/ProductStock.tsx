import { Chip } from "@mui/material";

interface ProductStockProps {
  stock: number;
}

export default function ProductStock({
  stock,
}: ProductStockProps) {
  return (
    <Chip
      color={stock > 0 ? "success" : "error"}
      label={
        stock > 0
          ? `In Stock (${stock})`
          : "Out of Stock"
      }
    />
  );
}