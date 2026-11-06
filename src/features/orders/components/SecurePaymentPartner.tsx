import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

// Razorpay brand palette
const COLORS = {
  white: "#FFFFFF",
  navy: "#072654", // Razorpay dark navy (primary text)
  blue: "#3395FF", // Razorpay brand blue (accents)
  muted: "#5B6B86",
  border: "#E3E9F3",
  tint: "#F3F8FF",
};

const METHODS = ["UPI", "Cards", "Net Banking", "Wallets"];

export default function SecurePaymentPartner() {
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.navy,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, alignItems: "center" }}
      >
        <LockOutlinedIcon sx={{ fontSize: 18, color: COLORS.blue }} />
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.875rem", color: COLORS.navy }}
        >
          Secure payments
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: COLORS.border }} />

      {/* Payment partner */}
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.muted }}>
          Payments powered by
        </Typography>

        <Box
          component="img"
          src="/payment-icons/razorpay.svg"
          alt="Razorpay"
          sx={{
            display: "block",
            mt: 1,
            height: 24,
            width: "auto",
            maxWidth: "100%",
          }}
        />

        <Typography sx={{ mt: 1.5, fontSize: "0.8rem", color: COLORS.muted }}>
          Pay securely using any of the methods below.
        </Typography>

        {/* Accepted methods */}
        <Stack
          direction="row"
          useFlexGap
          sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.75 }}
        >
          {METHODS.map((label) => (
            <Box
              key={label}
              sx={{
                px: 1.25,
                py: 0.5,
                bgcolor: COLORS.tint,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
                color: COLORS.navy,
              }}
            >
              {label}
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />

      {/* Trust note */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, alignItems: "center" }}
      >
        <VerifiedUserOutlinedIcon
          sx={{ fontSize: 16, color: COLORS.blue, flexShrink: 0 }}
        />
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.muted }}>
          PCI DSS compliant. We never see or store your card details.
        </Typography>
      </Stack>
    </Card>
  );
}