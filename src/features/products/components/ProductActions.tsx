
import { Box, Stack, Typography } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import AppButton from "@/components/ui/AppButton";

interface ProductActionsProps {
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  disabled?: boolean;
  buttonText?: string;
  wishlistDisabled?: boolean;
}

export default function ProductActions({
  onAddToCart,
  onAddToWishlist,
  disabled = false,
  buttonText = "Add to Cart",
  wishlistDisabled = false,
}: ProductActionsProps) {
  const isOutOfStock = buttonText === "Out of Stock";

  return (
    <Stack spacing={1.5}>
      {/* Primary action */}
      <AppButton
        fullWidth
        onClick={onAddToCart}
        disabled={disabled}
        sx={{
          backgroundColor: "#00D9FF",
          color: "#080B12",
          border: "1px solid #00D9FF",
          borderRadius: "999px",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#00D9FF",
            borderColor: "#00D9FF",
            boxShadow: "none",
          },
        }}
      >
        {buttonText}
      </AppButton>

      {/* Wishlist */}
      <AppButton
        fullWidth
        variant="outlined"
        onClick={onAddToWishlist}
        disabled={wishlistDisabled}
        startIcon={<FavoriteBorderOutlinedIcon />}
        sx={{
          backgroundColor: "#080B12",
          color: "#00D9FF",
          border: "1px solid #00D9FF",
          borderRadius: "999px",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#111722",
            borderColor: "#00D9FF",
            boxShadow: "none",
          },
        }}
      >
        Add to Wishlist
      </AppButton>

      {/* Small reassurance */}
      {!isOutOfStock && (
        <Box
          sx={{
            pt: 0.5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.72rem",
                sm: "0.75rem",
              },
              lineHeight: 1.5,
            }}
          >
            Secure checkout · Quality products · Easy ordering
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
