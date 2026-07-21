import {
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

export default function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Payment Method
        </Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(event) =>
            onChange(event.target.value as PaymentMethod)
          }
        >
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery"
          />

          <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label="Razorpay (Coming Soon)"
            disabled
          />

          <FormControlLabel
            value="upi"
            control={<Radio />}
            label="UPI (Coming Soon)"
            disabled
          />
        </RadioGroup>
      </CardContent>
    </Card>
  );
}