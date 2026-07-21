import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Order } from "../types/order";

import {
  createOrder,
  getOrders,
} from "../services/orderService";

const ORDER_QUERY_KEY = ["orders"];

export function useOrders() {
  return useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: getOrders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      order: Omit<
        Order,
        "id" | "createdAt" | "updatedAt"
      >
    ) => createOrder(order),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEY,
      });
    },
  });
}