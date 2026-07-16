import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

interface OrderSummaryProps {
  subtotal: number;
}

export default function OrderSummary({
  subtotal,
}: OrderSummaryProps) {
  const shipping = subtotal > 0 ? 0 : 0;

  const total = subtotal + shipping;

  return (
    <Card
      sx={{
        borderRadius: 3,
        position: "sticky",
        top: 100,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          Order Summary
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography>Subtotal</Typography>

          <Typography>
            ₹{subtotal}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography>Shipping</Typography>

          <Typography
            color="success.main"
          >
            FREE
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Total
          </Typography>

          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 700,
            }}
          >
            ₹{total}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
        >
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  );
}