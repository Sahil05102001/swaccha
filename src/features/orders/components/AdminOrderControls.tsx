import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../types/order";

import {
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "../hooks/useOrders";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { generateInvoice } from "../utils/generateInvoice";

interface Props {
  order: Order;
}

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
];

export default function AdminOrderControls({
  order,
}: Props) {
  const [orderStatus, setOrderStatus] =
    useState<OrderStatus>(order.orderStatus);

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>(order.paymentStatus);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const orderMutation = useUpdateOrderStatus();
  const paymentMutation = useUpdatePaymentStatus();

  useEffect(() => {
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
  }, [order]);

  const saving =
    orderMutation.isPending ||
    paymentMutation.isPending;

  const handleDownloadInvoice = () => {
    generateInvoice({
      orderId: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone:
        order.shippingAddress.phoneNumber,
      paymentMethod:
        order.paymentMethod.toUpperCase(),
      paymentStatus: order.paymentStatus,
      orderDate: order.createdAt
        .toDate()
        .toLocaleString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      discount: 0,
      total: order.totalAmount,
    });
  };

  async function handleSave() {
    try {
      if (orderStatus !== order.orderStatus) {
        await orderMutation.mutateAsync({
          orderId: order.id,
          orderStatus,
        });
      }

      if (
        paymentStatus !== order.paymentStatus
      ) {
        await paymentMutation.mutateAsync({
          orderId: order.id,
          paymentStatus,
        });
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "Order updated successfully.",
      });
    } catch {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Failed to update order. Please try again.",
      });
    }
  }

  return (
    <>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Admin Controls
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </Button>
            <FormControl fullWidth>
              <InputLabel>
                Order Status
              </InputLabel>

              <Select
                label="Order Status"
                value={orderStatus}
                onChange={(e) =>
                  setOrderStatus(
                    e.target.value as OrderStatus
                  )
                }
              >
                {ORDER_STATUSES.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Payment Status
              </InputLabel>

              <Select
                label="Payment Status"
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(
                    e.target.value as PaymentStatus
                  )
                }
              >
                {PAYMENT_STATUSES.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}