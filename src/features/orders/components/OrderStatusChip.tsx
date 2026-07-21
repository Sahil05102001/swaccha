import Chip from "@mui/material/Chip";

import type { OrderStatus } from "../types/order";

interface OrderStatusChipProps {
  status: OrderStatus;
}

export default function OrderStatusChip({
  status,
}: OrderStatusChipProps) {
  const getChipColor = () => {
    switch (status) {
      case "pending":
        return "warning";

      case "confirmed":
        return "info";

      case "processing":
        return "secondary";

      case "shipped":
        return "primary";

      case "delivered":
        return "success";

      case "cancelled":
        return "error";

      default:
        return "default";
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getChipColor()}
      size="small"
    />
  );
}