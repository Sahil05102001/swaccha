import {
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
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
  // Statuses the admin may pick. Defaults to every status.
  options?: OrderStatus[];
}

export default function UpdateOrderStatus({
  value,
  onChange,
  disabled = false,
  options = ORDER_STATUS_OPTIONS,
}: UpdateOrderStatusProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Order Status
      </Typography>

      <FormControl
        fullWidth
        disabled={disabled || options.length <= 1}
      >
        <InputLabel id="order-status-label">
          Order Status
        </InputLabel>

        <Select<OrderStatus>
          labelId="order-status-label"
          value={value}
          label="Order Status"
          onChange={(event) =>
            onChange(
              event.target.value as OrderStatus
            )
          }
        >
          {options.map((option) => (
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