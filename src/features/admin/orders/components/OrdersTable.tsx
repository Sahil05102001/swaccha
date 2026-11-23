import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import OrderStatusChip from "@/features/orders/components/OrderStatusChip";
import type { Order } from "@/features/orders/types/order";

interface OrdersTableProps {
  orders: Order[];
  onView: (orderId: string) => void;
}

function paymentColor(status: Order["paymentStatus"]) {
  if (status === "paid") return "success";
  if (status === "failed") return "error";
  if (status === "refunded" || status === "partially_refunded") return "info";
  return "warning";
}

export default function OrdersTable({ orders, onView }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No orders on this page. Use Next to continue.
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order No.</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="center">Items</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {order.orderNumber}
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {order.customerName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ wordBreak: "break-all" }}
                >
                  {order.customerEmail}
                </Typography>
              </TableCell>

              <TableCell align="center">{order.items.length}</TableCell>

              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </TableCell>

              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={order.paymentStatus.replace("_", " ")}
                  color={paymentColor(order.paymentStatus)}
                />
                {order.refundRequired && (
                  <Chip
                    size="small"
                    variant="outlined"
                    color="error"
                    label="Refund needed"
                    sx={{ ml: 0.5 }}
                  />
                )}
              </TableCell>

              <TableCell>
                <OrderStatusChip status={order.orderStatus} />
              </TableCell>

              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {order.createdAt
                  ? order.createdAt.toDate().toLocaleDateString("en-IN")
                  : "-"}
              </TableCell>

              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onView(order.id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}