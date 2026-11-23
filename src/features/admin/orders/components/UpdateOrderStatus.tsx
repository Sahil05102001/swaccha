import { MenuItem } from "@mui/material";

import AdminSelect from "@/features/admin/components/AdminSelect";
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
    <AdminSelect
      fullWidth
      label="Order status"
      value={value}
      disabled={disabled || options.length <= 1}
      onChange={(event) => onChange(event.target.value as OrderStatus)}
      helperText={
        options.length <= 1
          ? "This order is final. Its status can no longer be changed."
          : "Orders move one step at a time."
      }
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </MenuItem>
      ))}
    </AdminSelect>
  );
}