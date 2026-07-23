import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "../services/adminOrderService";

export const ADMIN_ORDERS_QUERY_KEY = [
  "admin-orders",
] as const;

export function useAdminOrders() {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: getAdminOrders,
    retry: false,
  });
}