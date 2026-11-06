import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useLocation, useNavigate } from "react-router-dom";

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const pillButtonBase = {
  borderRadius: 999,
  px: 3,
  py: 1.25,
  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",
  boxShadow: "none",
  transition: "none",
  "&:hover": { boxShadow: "none" },
};

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: pass it when navigating, e.g. navigate("/order-success", { state: { orderId } })
  const orderId = location.state?.orderId;

  return (
    <Stack
      sx={{
        minHeight: "80vh",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        justifyContent: "center",
        alignItems: "center",
        bgcolor: COLORS.white,
      }}
    >
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          borderColor: COLORS.border,
          bgcolor: COLORS.white,
          backgroundImage: "none",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ alignItems: "center" }}>
          {/* Success mark */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              borderRadius: "50%",
              border: `2px solid ${COLORS.blue}`,
              color: COLORS.blue,
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: { xs: 30, sm: 34 } }} />
          </Box>

          {/* Message */}
          <Stack spacing={1}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.35rem", sm: "1.6rem" },
                lineHeight: 1.25,
                color: COLORS.text,
              }}
            >
              Order placed successfully
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                lineHeight: 1.6,
                color: COLORS.muted,
              }}
            >
              Thank you for shopping with Swachha. Your order will be
              processed shortly.
            </Typography>
          </Stack>

          {/* Order reference (only shown when available) */}
          {orderId && (
            <Box
              sx={{
                width: "100%",
                py: 1.5,
                px: 2,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.muted }}>
                Order ID
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.text,
                  wordBreak: "break-all",
                }}
              >
                {orderId}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: "100%", pt: 0.5 }}
          >
            <Button
              fullWidth
              disableRipple
              disableElevation
              variant="contained"
              onClick={() => navigate("/orders")}
              sx={{
                ...pillButtonBase,
                bgcolor: COLORS.black,
                color: COLORS.white,
                "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
              }}
            >
              View My Orders
            </Button>

            <Button
              fullWidth
              disableRipple
              variant="outlined"
              onClick={() => navigate("/products")}
              sx={{
                ...pillButtonBase,
                color: COLORS.text,
                borderColor: COLORS.border,
                "&:hover": {
                  borderColor: COLORS.text,
                  bgcolor: "transparent",
                  boxShadow: "none",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}