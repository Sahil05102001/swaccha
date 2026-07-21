import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppButton from "@/components/ui/AppButton";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={3}
      sx={{
        py: 10,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <ShoppingCartOutlinedIcon
        sx={{
          fontSize: 90,
          color: "text.disabled",
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        Your cart is empty
      </Typography>

      <Typography color="text.secondary">
        Looks like you haven't added anything yet.
      </Typography>

      <AppButton
        onClick={() => navigate("/products")}
      >
        Continue Shopping
      </AppButton>
    </Stack>
  );
}