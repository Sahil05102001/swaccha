import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

interface PlaceOrderButtonProps {
  onClick: () => void;
  loading?: boolean;
  /** Disables the button without showing the spinner (e.g. no address selected). */
  disabled?: boolean;
  /** Short note shown under the button while it is disabled. */
  disabledReason?: string;
  /** Show the Google Pay / PhonePe / Paytm logos (online payment only). */
  showPaymentIcons?: boolean;
}

const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  blue: "#00D9FF",
  disabledBg: "#E0E0E0",
};

const paymentIcons = [
  {
    src: "/payment-icons/gpay.svg",
    alt: "Google Pay",
  },
  {
    src: "/payment-icons/phonepe.svg",
    alt: "PhonePe",
  },
  {
    src: "/payment-icons/paytm.svg",
    alt: "Paytm",
  },
];

export default function PlaceOrderButton({
  onClick,
  loading = false,
  disabled = false,
  disabledReason,
  showPaymentIcons = true,
}: PlaceOrderButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <Stack spacing={1}>
      <Button
        fullWidth
        size="large"
        disableRipple
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={loading}
        sx={{
          minHeight: 60,
          px: 2,
          py: 1,
          borderRadius: "999px",
          fontWeight: 700,
          textTransform: "none",
          color: COLORS.white,
          bgcolor: COLORS.black,
          border: `1px solid ${COLORS.black}`,
          boxShadow: "none",
          transition: "none",
          "&:hover": {
            bgcolor: COLORS.text,
            borderColor: COLORS.text,
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: `2px solid ${COLORS.blue}`,
            outlineOffset: 2,
          },
          // Loading keeps the dark look so the spinner stays visible.
          "&.Mui-disabled": {
            color: loading ? "rgba(255, 255, 255, 0.7)" : COLORS.muted,
            bgcolor: loading ? "#333333" : COLORS.disabledBg,
            borderColor: loading ? "#333333" : COLORS.disabledBg,
          },
        }}
      >
        {loading ? (
          <CircularProgress
            size={22}
            aria-label="Placing order"
            sx={{ color: COLORS.white }}
          />
        ) : (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
              minWidth: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: {
                  xs: "0.85rem",
                  sm: "1rem",
                },
                fontWeight: 800,
                letterSpacing: "0.02em",
                color: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              CHECKOUT
            </Typography>

            {showPaymentIcons && (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: "center",
                  flexShrink: 0,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {paymentIcons.map((payment) => (
                  <Box
                    key={payment.alt}
                    component="img"
                    src={payment.src}
                    alt={payment.alt}
                    sx={{
                      display: "block",
                      width: {
                        xs: 25,
                        sm: 29,
                      },
                      height: {
                        xs: 25,
                        sm: 29,
                      },
                      objectFit: "contain",
                      bgcolor: COLORS.white,
                      borderRadius: "50%",
                      p: 0.25,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Button>

      {disabled && !loading && disabledReason && (
        <Typography
          role="status"
          sx={{
            fontSize: "0.85rem",
            textAlign: "center",
            color: COLORS.muted,
          }}
        >
          {disabledReason}
        </Typography>
      )}
    </Stack>
  );
}