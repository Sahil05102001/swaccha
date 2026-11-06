import {
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SectionCard from "@/components/common/SectionCard";
import OrderStatusChip from "@/features/orders/components/OrderStatusChip";

import { useRecentOrders } from "../hooks/useRecentOrders";

export default function RecentOrdersTable() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError } = useRecentOrders();

  return (
    <SectionCard
      title="Recent Orders"
      action={
        <Button size="small" onClick={() => navigate("/admin/orders")}>
          View all
        </Button>
      }
    >
      {isLoading ? (
        <CircularProgress size={24} aria-label="Loading recent orders" />
      ) : isError ? (
        <Alert severity="error">Failed to load recent orders.</Alert>
      ) : orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet.</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <OrderStatusChip status={order.orderStatus} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </SectionCard>
  );
}