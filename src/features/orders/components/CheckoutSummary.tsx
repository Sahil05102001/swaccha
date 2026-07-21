import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CheckoutSummary({
  subtotal,
  shipping,
  total,
}: CheckoutSummaryProps) {

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          Order Summary
        </Typography>

        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal}</Typography>
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography>Shipping</Typography>
            <Typography>₹{shipping}</Typography>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              Total
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              ₹{total}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}