import type { Order } from "@/features/orders/types/order";

export interface TopCustomer {
  userId: string;
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

export function computeTopCustomers(orders: Order[]): TopCustomer[] {
  const map = new Map<string, TopCustomer>();

  for (const order of orders) {
    const created = order.createdAt?.toDate() ?? null;

    const entry = map.get(order.userId) ?? {
      userId: order.userId,
      customerName: order.customerName || "Unknown Customer",
      customerEmail: order.customerEmail || "",
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: created,
    };

    entry.totalOrders += 1;
    entry.totalSpent += order.totalAmount;

    if (created && (!entry.lastOrderDate || created > entry.lastOrderDate)) {
      entry.lastOrderDate = created;
    }

    map.set(order.userId, entry);
  }

  return [...map.values()]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
}