import { useQuery } from "@tanstack/react-query";
import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { isUnpaidRazorpayOrder } from "@/features/orders/services/orderService";
import type { Order } from "@/features/orders/types/order";

export const SALES_WINDOW_DAYS = 30;
export const SALES_MAX_ORDERS = 300;

export const SALES_ORDERS_KEY = ["dashboard-sales-orders"] as const;

async function fetchSalesOrders(): Promise<Order[]> {
  const since = Timestamp.fromMillis(
    Date.now() - SALES_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  // The limit applies here, in the query, BEFORE the filtering below.
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("createdAt", ">=", since),
      orderBy("createdAt", "desc"),
      limit(SALES_MAX_ORDERS),
    ),
  );

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Order)
    .filter(
      (order) =>
        order.orderStatus !== "cancelled" &&
        order.orderStatus !== "returned" &&
        !isUnpaidRazorpayOrder(order),
    );
}

/** All three dashboard cards share this one query. */
export function useSalesOrders<T = Order[]>(select?: (orders: Order[]) => T) {
  return useQuery({
    queryKey: SALES_ORDERS_KEY,
    queryFn: fetchSalesOrders,
    select,
    staleTime: 10 * 60_000,
    retry: false,
  });
}