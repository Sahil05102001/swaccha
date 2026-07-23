import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order";

import { useUpdateAdminOrder } from "../hooks/useUpdateAdminOrder";
import UpdateOrderStatus from "./UpdateOrderStatus";
import UpdatePaymentStatus from "./UpdatePaymentStatus";

interface OrderActionsProps {
  order: Order;
}

export default function OrderActions({
  order,
}: OrderActionsProps) {
  const [orderStatus, setOrderStatus] =
    useState<OrderStatus>(order.orderStatus);

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>(order.paymentStatus);

  const { mutate, isPending } =
    useUpdateAdminOrder();

  useEffect(() => {
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
  }, [order]);

  const hasChanges = useMemo(() => {
    return (
      orderStatus !== order.orderStatus ||
      paymentStatus !== order.paymentStatus
    );
  }, [
    order.orderStatus,
    order.paymentStatus,
    orderStatus,
    paymentStatus,
  ]);

  const handleSave = () => {
    mutate({
      orderId: order.id,
      orderStatus,
      paymentStatus,
    });
  };

  return (
    <Stack spacing={4}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
        }}
      >
        Admin Actions
      </Typography>

      <UpdateOrderStatus
        value={orderStatus}
        onChange={setOrderStatus}
        disabled={isPending}
      />

      <Divider />

      <UpdatePaymentStatus
        value={paymentStatus}
        onChange={setPaymentStatus}
        disabled={isPending}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!hasChanges || isPending}
      >
        {isPending
          ? "Saving..."
          : "Save Changes"}
      </Button>
    </Stack>
  );
}