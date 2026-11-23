import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";
import type { OrderStatus } from "@/features/orders/types/order";

import { updateAdminOrder } from "../services/adminOrderService";
import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";

interface UpdateAdminOrderInput {
  orderId: string;
  orderStatus?: OrderStatus;
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Date;
  notes?: string;
  codPaymentCollected?: boolean;
}

export function useUpdateAdminOrder() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ orderId, ...updates }: UpdateAdminOrderInput) =>
      updateAdminOrder(orderId, updates),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["order"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-orders"] }),
      ]);

      showSnackbar("Order updated successfully.", "success");
    },

    onError: (error) => {
      console.error("Update order failed:", error);

      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to update order.",
        "error",
      );
    },
  });
}