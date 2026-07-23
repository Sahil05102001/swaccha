import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import type { Order } from "@/features/orders/types/order";

import OrderDetailsDialog from "./OrderDetailsDialog";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({
  orders,
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  if (orders.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          py: 4,
          textAlign: "center",
        }}
      >
        No orders found.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Order No.
              </TableCell>

              <TableCell>
                Customer
              </TableCell>

              <TableCell align="center">
                Items
              </TableCell>

              <TableCell align="right">
                Total
              </TableCell>

              <TableCell>
                Payment
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Date
              </TableCell>

              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                hover
              >
                <TableCell>
                  {order.orderNumber}
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {order.customerName}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {order.customerEmail}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {order.items.length}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={
                      order.paymentStatus
                    }
                    color={
                      order.paymentStatus ===
                      "paid"
                        ? "success"
                        : order.paymentStatus ===
                          "failed"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={
                      order.orderStatus
                    }
                  />
                </TableCell>

                <TableCell>
                  {order.createdAt
                    .toDate()
                    .toLocaleDateString(
                      "en-IN"
                    )}
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDetailsDialog
        open={
          selectedOrder !== null
        }
        order={selectedOrder}
        onClose={
          handleCloseDialog
        }
      />
    </>
  );
}