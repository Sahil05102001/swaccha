import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { updateAdminOrderStatus } from "../services/adminOrderService";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: string;
    }) =>
      updateAdminOrderStatus(
        orderId,
        orderStatus
      ),

    onSuccess: async () => {
      showSnackbar(
        "Order status updated successfully.",
        "success"
      );

      await queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },

    onError: () => {
      showSnackbar(
        "Failed to update order status.",
        "error"
      );
    },
  });
}