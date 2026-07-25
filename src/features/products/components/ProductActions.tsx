import { Stack } from "@mui/material";

import AppButton from "@/components/ui/AppButton";

interface ProductActionsProps {
  onAddToCart: () => void;
  disabled?: boolean;
  buttonText?: string;
}

export default function ProductActions({
  onAddToCart,
  disabled = false,
  buttonText = "Add to Cart",
}: ProductActionsProps) {
  return (
    <Stack spacing={2}>
      <AppButton
        fullWidth
        onClick={onAddToCart}
        disabled={disabled}
      >
        {buttonText}
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