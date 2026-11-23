import type { Order } from "@/features/orders/types/order";

export interface CategorySales {
  category: string;
  totalRevenue: number;
  totalSold: number;
}

/** The card shows only the best-selling categories, so its height stays predictable. */
export const TOP_CATEGORIES_LIMIT = 5;

export function computeCategorySales(
  orders: Order[],
  categoryOf: Map<string, string>,
): CategorySales[] {
  const map = new Map<string, CategorySales>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      const category = categoryOf.get(item.productId) || "Uncategorized";
      const entry = map.get(category) ?? {
        category,
        totalRevenue: 0,
        totalSold: 0,
      };

      entry.totalRevenue += item.quantity * item.price;
      entry.totalSold += item.quantity;
      map.set(category, entry);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, TOP_CATEGORIES_LIMIT);
}