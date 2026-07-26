import {
  Timestamp,
  collection,
  getDocs,
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

export async function getDashboardStats(): Promise<DashboardStats> {
  const productsSnapshot = await getDocs(
    collection(db, "products")
  );

  const ordersSnapshot = await getDocs(
    collection(db, "orders")
  );

  const usersSnapshot = await getDocs(
    collection(db, "users")
  );

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  let totalRevenue = 0;
  let revenueToday = 0;
  let revenueThisMonth = 0;

  let pendingOrders = 0;
  let confirmedOrders = 0;
  let packedOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  ordersSnapshot.docs.forEach((doc) => {
    const order = doc.data();

    const amount =
      typeof order.totalAmount === "number"
        ? order.totalAmount
        : 0;

    totalRevenue += amount;

    const createdAt =
      order.createdAt instanceof Timestamp
        ? order.createdAt.toDate()
        : null;

    if (createdAt) {
      if (createdAt >= startOfToday) {
        revenueToday += amount;
      }

      if (createdAt >= startOfMonth) {
        revenueThisMonth += amount;
      }
    }

    switch (order.orderStatus) {
      case "pending":
        pendingOrders++;
        break;

      case "confirmed":
        confirmedOrders++;
        break;

      case "packed":
        packedOrders++;
        break;

      case "shipped":
        shippedOrders++;
        break;

      case "delivered":
        deliveredOrders++;
        break;

      case "cancelled":
        cancelledOrders++;
        break;
    }
  });

  return {
    totalProducts: productsSnapshot.size,
    totalOrders: ordersSnapshot.size,
    totalCustomers: usersSnapshot.size,
    totalRevenue,

    revenueToday,
    revenueThisMonth,

    averageOrderValue:
      ordersSnapshot.size > 0
        ? Math.round(
            totalRevenue / ordersSnapshot.size
          )
        : 0,

    pendingOrders,
    confirmedOrders,
    packedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
  };
}