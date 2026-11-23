import type { Order } from "@/features/orders/types/order";

export interface TopSellingProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
}

export function computeTopSellingProducts(
  orders: Order[],
): TopSellingProduct[] {
  const map = new Map<string, TopSellingProduct>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      const entry = map.get(item.productId) ?? {
        productId: item.productId,
        productName: item.name || "Unknown Product",
        totalSold: 0,
        revenue: 0,
      };

      entry.totalSold += item.quantity;
      entry.revenue += item.quantity * item.price;
      map.set(item.productId, entry);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);
}