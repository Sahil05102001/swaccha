import { Typography } from "@mui/material";

import { SALES_MAX_ORDERS, SALES_WINDOW_DAYS } from "../hooks/useSalesOrders";

export default function SalesScopeNote() {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", mb: 2 }}
    >
      Based on up to the {SALES_MAX_ORDERS} most recent orders from the last{" "}
      {SALES_WINDOW_DAYS} days, so it may not include every order in that
      period. Cancelled, returned and unpaid online orders are not counted.
    </Typography>
  );
}