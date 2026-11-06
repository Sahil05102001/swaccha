import {
  Timestamp,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
  query,
  sum,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;

  revenueToday: number;
  revenueThisMonth: number;
  averageOrderValue: number;

  pendingOrders: number;
  confirmedOrders: number;
  packedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

const STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

/**
 * Uses Firestore's server-side count and sum, so no document is downloaded.
 * Cost: roughly one read per 1,000 matching documents, per query.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const orders = collection(db, "orders");

  const now = new Date();
  const startOfToday = Timestamp.fromDate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const startOfMonth = Timestamp.fromDate(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );

  const [products, users, all, today, month, ...byStatus] =
    await Promise.all([
      getCountFromServer(collection(db, "products")),
      getCountFromServer(collection(db, "users")),
      getAggregateFromServer(orders, {
        orderCount: count(),
        revenue: sum("totalAmount"),
      }),
      getAggregateFromServer(
        query(orders, where("createdAt", ">=", startOfToday)),
        { revenue: sum("totalAmount") },
      ),
      getAggregateFromServer(
        query(orders, where("createdAt", ">=", startOfMonth)),
        { revenue: sum("totalAmount") },
      ),
      ...STATUSES.map((status) =>
        getCountFromServer(query(orders, where("orderStatus", "==", status))),
      ),
    ]);

  const totalOrders = all.data().orderCount;
  const totalRevenue = all.data().revenue;
  const [pending, confirmed, packed, shipped, delivered, cancelled] =
    byStatus.map((snapshot) => snapshot.data().count);

  return {
    totalProducts: products.data().count,
    totalOrders,
    totalCustomers: users.data().count,
    totalRevenue,

    revenueToday: today.data().revenue,
    revenueThisMonth: month.data().revenue,
    averageOrderValue:
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,

    pendingOrders: pending,
    confirmedOrders: confirmed,
    packedOrders: packed,
    shippedOrders: shipped,
    deliveredOrders: delivered,
    cancelledOrders: cancelled,
  };
}