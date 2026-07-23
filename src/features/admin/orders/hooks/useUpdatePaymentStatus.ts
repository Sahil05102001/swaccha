import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { updateAdminOrder } from "../services/adminOrderService";
import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";

interface UpdatePaymentStatusInput {
  orderId: string;
  paymentStatus: "pending" | "paid" | "failed";
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: UpdatePaymentStatusInput) =>
      updateAdminOrder(orderId, {
        paymentStatus,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDERS_QUERY_KEY,
      });

      showSnackbar(
        "Payment status updated successfully.",
        "success"
      );
    },

    onError: () => {
      showSnackbar(
        "Failed to update payment status.",
        "error"
      );
    },
  });
}