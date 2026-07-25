import { useQuery } from "@tanstack/react-query";

import { getOrdersByUserId } from "@/features/orders/services/orderService";
import type { Order } from "@/features/orders/types/order";

export interface CustomerAnalytics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date | null;
  recentOrders: Order[];
}

export function useCustomerAnalytics(userId?: string) {
  return useQuery<CustomerAnalytics>({
    queryKey: ["customer-analytics", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const orders = await getOrdersByUserId(userId!);

      const totalOrders = orders.length;

      const totalSpent = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      const averageOrderValue =
        totalOrders > 0
          ? totalSpent / totalOrders
          : 0;

      const lastOrderDate =
        totalOrders > 0
          ? orders[0].createdAt.toDate()
          : null;

      const recentOrders = orders.slice(0, 5);

      return {
        totalOrders,
        totalSpent,
        averageOrderValue,
        lastOrderDate,
        recentOrders,
      };
    },
  });
}