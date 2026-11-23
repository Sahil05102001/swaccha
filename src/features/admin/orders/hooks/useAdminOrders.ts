import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { OrderStatus } from "@/features/orders/types/order";

import {
  getAdminOrders,
  getAdminOrdersPage,
  type AdminOrdersPage,
} from "../services/adminOrderService";

export const ADMIN_ORDERS_QUERY_KEY = ["admin-orders"] as const;

export type OrderStatusFilter = OrderStatus | "all";

/** Every order at once. Kept for pages that still need the full list. */
export function useAdminOrders() {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: getAdminOrders,
    retry: false,
  });
}

/**
 * Pages of orders. The key starts with "admin-orders", so existing
 * invalidations after an order update still reach it.
 */
export function useAdminOrdersPage(status: OrderStatusFilter) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, "page", status],
    queryFn: ({ pageParam }) => getAdminOrdersPage(pageParam, status),
    initialPageParam: null as AdminOrdersPage["last"],
    getNextPageParam: (page) => (page.hasMore ? page.last : undefined),
    staleTime: 60_000,
    retry: false,
  });
}