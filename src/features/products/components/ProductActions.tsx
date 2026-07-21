import { Stack } from "@mui/material";

import AppButton from "@/components/ui/AppButton";

interface ProductActionsProps {
  onAddToCart: () => void;
}

export default function ProductActions({
  onAddToCart,
}: ProductActionsProps) {
  return (
    <Stack spacing={2}>
      <AppButton
        fullWidth
        onClick={onAddToCart}
      >
        Add to Cart
      </AppButton>

      <AppButton
        fullWidth
        variant="outlined"
      >
        Add to Wishlist
      </AppButton>
    </Stack>
  );
}