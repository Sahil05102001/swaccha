import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Order } from "../types/order";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/orderService";

const ORDER_QUERY_KEY = ["orders"];
const ADMIN_ORDER_QUERY_KEY = ["admin-orders"];

export function useOrders() {
  return useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: getOrders,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ADMIN_ORDER_QUERY_KEY,
    queryFn: getAllOrders,
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

      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDER_QUERY_KEY,
      });
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: Order["orderStatus"];
    }) => updateOrderStatus(orderId, orderStatus),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["order", variables.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDER_QUERY_KEY,
      });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: string;
      paymentStatus: Order["paymentStatus"];
    }) => updatePaymentStatus(
      orderId,
      paymentStatus
    ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["order", variables.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDER_QUERY_KEY,
      });
    },
  });
}