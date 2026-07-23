import { useEffect, useState } from "react";

import {
  Button,
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
  currentStatus: PaymentStatus;
  loading?: boolean;
  onSave: (status: PaymentStatus) => void;
}

export default function UpdatePaymentStatus({
  currentStatus,
  loading = false,
  onSave,
}: UpdatePaymentStatusProps) {
  const [status, setStatus] =
    useState<PaymentStatus>(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const hasChanged = status !== currentStatus;

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Update Payment Status
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="payment-status-label">
          Payment Status
        </InputLabel>

        <Select<PaymentStatus>
          labelId="payment-status-label"
          value={status}
          label="Payment Status"
          onChange={(event) =>
            setStatus(
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

      <Button
        variant="contained"
        onClick={() => onSave(status)}
        disabled={!hasChanged || loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Stack>
  );
}