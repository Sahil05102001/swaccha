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

import type { OrderStatus } from "@/features/orders/types/order";

import { ORDER_STATUS_OPTIONS } from "../constants/orderStatusOptions";

interface UpdateOrderStatusProps {
  currentStatus: OrderStatus;
  loading?: boolean;
  onSave: (status: OrderStatus) => void;
}

export default function UpdateOrderStatus({
  currentStatus,
  loading = false,
  onSave,
}: UpdateOrderStatusProps) {
  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

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
        Update Order Status
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="order-status-label">
          Order Status
        </InputLabel>

        <Select<OrderStatus>
          labelId="order-status-label"
          value={status}
          label="Order Status"
          onChange={(event) =>
            setStatus(event.target.value as OrderStatus)
          }
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
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