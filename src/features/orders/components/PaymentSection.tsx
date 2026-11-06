import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import type { PaymentMethod } from "../types/order";

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const COLORS = {
  white: "#FFFFFF",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
  blue: "#00D9FF",
};

// Pay online is listed first.
const OPTIONS: {
  value: PaymentMethod;
  title: string;
  description: string;
}[] = [
  {
    value: "razorpay",
    title: "Pay online",
    description: "Cards, UPI, Net Banking and Wallets via Razorpay.",
  },
  {
    value: "cod",
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives.",
  },
];

export default function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderTop: `2px solid ${COLORS.blue}`,
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          "&:last-child": {
            pb: { xs: 2, sm: 3 },
          },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            mb: 2.5,
            color: COLORS.text,
          }}
        >
          Payment method
        </Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(event) => onChange(event.target.value as PaymentMethod)}
          sx={{ gap: 1.5 }}
        >
          {OPTIONS.map((option) => {
            const selected = paymentMethod === option.value;

            return (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    disableRipple
                    sx={{
                      color: COLORS.muted,
                      "&.Mui-checked": {
                        color: COLORS.blue,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: {
                          xs: "0.95rem",
                          sm: "1rem",
                        },
                        color: COLORS.text,
                      }}
                    >
                      {option.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.875rem",
                        },
                        color: COLORS.muted,
                        lineHeight: 1.5,
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  px: { xs: 1, sm: 1.5 },
                  py: 1,
                  alignItems: "flex-start",
                  width: "100%",
                  border: "1px solid",
                  borderColor: selected ? COLORS.blue : COLORS.border,
                  bgcolor: selected
                    ? "rgba(0, 217, 255, 0.07)"
                    : COLORS.white,
                  borderRadius: 1.5,
                  "& .MuiFormControlLabel-label": {
                    minWidth: 0,
                    pt: 0.75,
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}