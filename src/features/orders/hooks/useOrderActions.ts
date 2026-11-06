import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cancelOrderRequest,
  refundOrderRequest,
} from "../services/orderActionsService";

function useRefreshOrders() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
      queryClient.invalidateQueries({ queryKey: ["order"] }),
    ]);
}

export function useCancelOrder(asAdmin = false) {
  const refresh = useRefreshOrders();

  return useMutation({
    mutationFn: (v: { orderId: string; reason: string }) =>
      cancelOrderRequest(v.orderId, v.reason, asAdmin),
    onSuccess: refresh,
  });
}

export function useRefundOrder() {
  const refresh = useRefreshOrders();

  return useMutation({
    mutationFn: (v: {
      orderId: string;
      amount?: number;
      reason: string;
      restock?: boolean;
    }) =>
      refundOrderRequest(v.orderId, {
        amount: v.amount,
        reason: v.reason,
        restock: v.restock,
      }),
    onSuccess: refresh,
  });
}