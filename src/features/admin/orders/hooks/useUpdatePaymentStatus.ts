import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";
import { updateAdminPaymentStatus } from "../services/adminOrderService";

import type { PaymentStatus } from "@/features/orders/types/order";

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: string;
      paymentStatus: PaymentStatus;
    }) =>
      updateAdminPaymentStatus(
        orderId,
        paymentStatus
      ),

    onSuccess: async () => {
      showSnackbar(
        "Payment status updated successfully.",
        "success"
      );

      await queryClient.invalidateQueries({
        queryKey: ADMIN_ORDERS_QUERY_KEY,
      });
    },

    onError: () => {
      showSnackbar(
        "Failed to update payment status.",
        "error"
      );
    },
  });
}