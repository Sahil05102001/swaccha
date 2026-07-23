import { Divider, Stack, Typography } from "@mui/material";

import type { Order } from "@/features/orders/types/order";

import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { useUpdatePaymentStatus } from "../hooks/useUpdatePaymentStatus";

import UpdateOrderStatus from "./UpdateOrderStatus";
import UpdatePaymentStatus from "./UpdatePaymentStatus";

interface OrderActionsProps {
  order: Order;
}

export default function OrderActions({
  order,
}: OrderActionsProps) {
  const updateOrderStatusMutation =
    useUpdateOrderStatus();

  const updatePaymentStatusMutation =
    useUpdatePaymentStatus();

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
        currentStatus={order.orderStatus}
        loading={
          updateOrderStatusMutation.isPending
        }
        onSave={(status) =>
          updateOrderStatusMutation.mutate({
            orderId: order.id,
            orderStatus: status,
          })
        }
      />

      <Divider />

      <UpdatePaymentStatus
        currentStatus={order.paymentStatus}
        loading={
          updatePaymentStatusMutation.isPending
        }
        onSave={(status) =>
          updatePaymentStatusMutation.mutate({
            orderId: order.id,
            paymentStatus: status,
          })
        }
      />
    </Stack>
  );
}