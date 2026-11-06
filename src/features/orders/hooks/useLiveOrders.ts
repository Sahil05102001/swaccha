import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { useSnackbar } from "@/contexts/SnackbarContext";
import { useAuth } from "@/features/auth/AuthContext";
import { db } from "@/firebase/firestore";

import { isUnpaidRazorpayOrder } from "../services/orderService";
import type { Order } from "../types/order";

const ACTIVE = ["pending", "confirmed", "packed", "shipped"];

const MESSAGES: Record<string, string> = {
  confirmed: "is confirmed",
  packed: "is packed and ready",
  shipped: "is on its way",
  delivered: "has been delivered",
  cancelled: "has been cancelled",
  returned: "has been marked as returned",
};

const toOrder = (d: QueryDocumentSnapshot<DocumentData>) =>
  ({ id: d.id, ...d.data() }) as Order;

/**
 * Keeps the customer's ACTIVE orders live. One listener, only on the page
 * that calls it, and paused while the tab is hidden.
 */
export function useLiveOrders() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;

    let unsubscribe: (() => void) | null = null;
    let resumed = false;
    const known = new Map<string, string>(); // order id -> last seen status

    const upsert = (order: Order) => {
      queryClient.setQueryData<Order[]>(["orders"], (old) => {
        if (!old) return old; // the list hasn't loaded yet; it will be fresh
        const exists = old.some((o) => o.id === order.id);
        const next = exists
          ? old.map((o) => (o.id === order.id ? order : o))
          : [order, ...old];
        return next.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
        );
      });

      // Keep an already-open details page in step too.
      if (queryClient.getQueryData(["order", order.id])) {
        queryClient.setQueryData(["order", order.id], order);
      }
    };

    const announce = (order: Order, previous: string | undefined) => {
      if (previous && previous !== order.orderStatus) {
        const text = MESSAGES[order.orderStatus];
        if (text) {
          showSnackbar(`Your order ${order.orderNumber} ${text}.`, "info");
        }
      }
    };

    // An order left the active set: fetch its final state once.
    const refresh = async (id: string) => {
      const previous = known.get(id);
      known.delete(id);

      try {
        const snap = await getDoc(doc(db, "orders", id));
        if (!snap.exists()) return;
        const order = { id: snap.id, ...snap.data() } as Order;
        upsert(order);
        announce(order, previous);
      } catch (error) {
        console.error("Could not refresh order:", error);
      }
    };

    const start = () => {
      if (unsubscribe) return;

      unsubscribe = onSnapshot(
        query(
          collection(db, "orders"),
          where("userId", "==", uid),
          where("orderStatus", "in", ACTIVE),
        ),
        (snapshot) => {
          const present = new Set<string>();

          snapshot.docs.forEach((d) => {
            const order = toOrder(d);
            // Online orders still awaiting payment aren't real orders yet.
            if (isUnpaidRazorpayOrder(order)) return;

            present.add(order.id);
            announce(order, known.get(order.id));
            known.set(order.id, order.orderStatus);
            upsert(order);
          });

          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") refresh(change.doc.id);
          });

          // Coming back to the tab: anything that finished meanwhile.
          if (resumed) {
            resumed = false;
            Array.from(known.keys())
              .filter((id) => !present.has(id))
              .forEach((id) => refresh(id));
          }
        },
        (error) => console.error("Live order updates stopped:", error),
      );
    };

    const stop = () => {
      unsubscribe?.();
      unsubscribe = null;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        resumed = true;
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [uid, queryClient, showSnackbar]);
}