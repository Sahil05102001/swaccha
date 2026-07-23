import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";
import type {
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order";

import { updateAdminOrder } from "../services/adminOrderService";
import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";

interface UpdateAdminOrderInput {
  orderId: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export function useUpdateAdminOrder() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (input: UpdateAdminOrderInput) =>
      updateAdminOrder(input.orderId, {
        orderStatus: input.orderStatus,
        paymentStatus: input.paymentStatus,
        trackingNumber: input.trackingNumber,
        deliveryPersonName: input.deliveryPersonName,
        deliveryPersonPhone: input.deliveryPersonPhone,
        estimatedDelivery: input.estimatedDelivery,
        notes: input.notes,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDERS_QUERY_KEY,
      });

      showSnackbar(
        "Order updated successfully.",
        "success"
      );
    },

    onError: (error) => {
      console.error("Update order failed:", error);

      showSnackbar(
        "Failed to update order.",
        "error"
      );
    },
  });
}