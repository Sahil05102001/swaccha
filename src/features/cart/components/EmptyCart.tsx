import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppButton from "@/components/ui/AppButton";

const COLORS = {
  white: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  blue: "#00D9FF",
};

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={{ xs: 2, sm: 3 }}
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 88, sm: 112 },
          height: { xs: 88, sm: 112 },
          borderRadius: "50%",
          border: `1px solid ${COLORS.blue}`,
          bgcolor: "rgba(0, 217, 255, 0.08)",
        }}
      >
        <ShoppingCartOutlinedIcon
          sx={{
            fontSize: { xs: 40, sm: 52 },
            color: "#0891B2",
          }}
        />
      </Box>

      <Typography
        component="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.5rem", sm: "2rem" },
          letterSpacing: "-0.02em",
          color: COLORS.text,
        }}
      >
        Your cart is empty
      </Typography>

      <Typography
        sx={{
          maxWidth: 360,
          color: COLORS.muted,
          fontSize: { xs: "0.95rem", sm: "1rem" },
          lineHeight: 1.7,
        }}
      >
        Looks like you haven't added anything yet.
      </Typography>

      <AppButton
        onClick={() => navigate("/products")}
        sx={{
          mt: 1,
          px: 4,
          py: 1.2,
          fontWeight: 700,
          textTransform: "none",
          color: "#080B12",
          bgcolor: COLORS.blue,
          boxShadow: "none",
          "&:hover": {
            bgcolor: COLORS.blue,
            boxShadow: "none",
          },
        }}
      >
        Continue shopping
      </AppButton>
    </Stack>
  );
}