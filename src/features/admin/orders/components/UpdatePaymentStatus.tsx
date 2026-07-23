import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import type { PaymentStatus } from "@/features/orders/types/order";

import { PAYMENT_STATUS_OPTIONS } from "../constants/paymentStatusOptions";

interface UpdatePaymentStatusProps {
  value: PaymentStatus;
  onChange: (status: PaymentStatus) => void;
  disabled?: boolean;
}

export default function UpdatePaymentStatus({
  value,
  onChange,
  disabled = false,
}: UpdatePaymentStatusProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Payment Status
      </Typography>

      <FormControl
        fullWidth
        disabled={disabled}
      >
        <InputLabel id="payment-status-label">
          Payment Status
        </InputLabel>

        <Select<PaymentStatus>
          labelId="payment-status-label"
          value={value}
          label="Payment Status"
          onChange={(event) =>
            onChange(
              event.target.value as PaymentStatus
            )
          }
        >
          {PAYMENT_STATUS_OPTIONS.map((option) => (
            <MenuItem
              key={option}
              value={option}
            >
              {option.charAt(0).toUpperCase() +
                option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}