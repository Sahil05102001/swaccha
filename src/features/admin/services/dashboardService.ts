import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const productsSnapshot = await getDocs(
    collection(db, "products")
  );

  console.log(
    "Products:",
    productsSnapshot.size,
    productsSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
  );

  const ordersSnapshot = await getDocs(
    collection(db, "orders")
  );

  console.log(
    "Orders:",
    ordersSnapshot.size,
    ordersSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
  );

  const usersSnapshot = await getDocs(
    collection(db, "users")
  );

  console.log(
    "Users:",
    usersSnapshot.size,
    usersSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
  );

  const totalRevenue = ordersSnapshot.docs.reduce(
    (sum, doc) => {
      const data = doc.data();

      return (
        sum +
        (typeof data.totalAmount === "number"
          ? data.totalAmount
          : 0)
      );
    },
    0
  );

  console.log("Revenue:", totalRevenue);

  return {
    totalProducts: productsSnapshot.size,
    totalOrders: ordersSnapshot.size,
    totalCustomers: usersSnapshot.size,
    totalRevenue,
  };
}