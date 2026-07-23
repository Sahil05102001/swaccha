import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { updateAdminOrder } from "../services/adminOrderService";
import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";

import type { OrderStatus } from "@/features/orders/types/order";

interface UpdateOrderStatusInput {
  orderId: string;
  orderStatus: OrderStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: UpdateOrderStatusInput) =>
      updateAdminOrder(orderId, {
        orderStatus,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDERS_QUERY_KEY,
      });

      showSnackbar(
        "Order status updated successfully.",
        "success"
      );
    },

    onError: () => {
      showSnackbar(
        "Failed to update order status.",
        "error"
      );
    },
  });
}