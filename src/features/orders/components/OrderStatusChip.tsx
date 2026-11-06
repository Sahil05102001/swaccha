import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import type { OrderStatus } from "../types/order";

interface OrderStatusChipProps {
  status: OrderStatus;
}

// Small colored dot per status; the chip itself stays neutral and minimal
const DOT_COLORS: Record<string, string> = {
  pending: "#B0B0B0",
  confirmed: "#00D9FF",
  packed: "#00D9FF",
  shipped: "#00D9FF",
  delivered: "#000000",
  returned: "#757575",
  cancelled: "#D32F2F",
};

export default function OrderStatusChip({ status }: OrderStatusChipProps) {
  const dotColor = DOT_COLORS[status] ?? "#B0B0B0";
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      icon={
        <Box
          component="span"
          sx={{
            width: 8,
            height: 8,
            ml: "10px !important",
            mr: "-2px !important",
            borderRadius: "50%",
            bgcolor: dotColor,
            flexShrink: 0,
          }}
        />
      }
      sx={{
        height: 28,
        bgcolor: "#FFFFFF",
        color: "#212121",
        borderColor: "#E0E0E0",
        fontWeight: 500,
        fontSize: "0.8rem",
        transition: "none",
      }}
    />
  );
}
