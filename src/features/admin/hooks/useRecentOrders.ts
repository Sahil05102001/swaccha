import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { isUnpaidRazorpayOrder } from "@/features/orders/services/orderService";
import type { Order } from "@/features/orders/types/order";

export function useRecentOrders() {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(10)),
      );

      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Order)
        .filter((order) => !isUnpaidRazorpayOrder(order))
        .slice(0, 5);
    },
    staleTime: 60_000,
    retry: false,
  });
}