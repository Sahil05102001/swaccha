import type { OrderStatus } from "@/features/orders/types/order";

export function formatOrderStatus(
  status: OrderStatus
) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}