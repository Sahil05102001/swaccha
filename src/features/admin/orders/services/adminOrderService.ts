import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";
import {
  getAllOrders,
  isUnpaidRazorpayOrder,
} from "@/features/orders/services/orderService";
import type { Order, OrderStatus } from "@/features/orders/types/order";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export async function getAdminOrders() {
  return getAllOrders();
}

export const ADMIN_ORDERS_PAGE_SIZE = 10;

export interface AdminOrdersPage {
  orders: Order[];
  last: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

/**
 * One page of orders, newest first, optionally for a single status.
 * Unpaid online orders are hidden after loading, so a page can have
 * fewer than 20 rows even when more orders exist.
 */
export async function getAdminOrdersPage(
  after: QueryDocumentSnapshot | null,
  status: OrderStatus | "all",
): Promise<AdminOrdersPage> {
  const constraints: QueryConstraint[] = [];

  if (status !== "all") {
    constraints.push(where("orderStatus", "==", status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (after) {
    constraints.push(startAfter(after));
  }

  constraints.push(limit(ADMIN_ORDERS_PAGE_SIZE + 1));

  const snap = await getDocs(query(collection(db, "orders"), ...constraints));

  const docs = snap.docs.slice(0, ADMIN_ORDERS_PAGE_SIZE);

  return {
    orders: docs
      .map((d) => ({ id: d.id, ...d.data() }) as Order)
      .filter((order) => !isUnpaidRazorpayOrder(order)),
    last: docs[docs.length - 1] ?? null,
    hasMore: snap.docs.length > ADMIN_ORDERS_PAGE_SIZE,
  };
}

interface UpdateAdminOrderInput {
  orderStatus?: OrderStatus;
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Date;
  notes?: string;
  codPaymentCollected?: boolean;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to manage orders.");
  }

  const idToken = await user.getIdToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(
      result?.message ?? "The order update could not be completed.",
    );
  }

  if (!result || typeof result !== "object") {
    throw new Error("The server returned an invalid response.");
  }

  return result;
}

export async function updateAdminOrder(
  orderId: string,
  updates: UpdateAdminOrderInput,
): Promise<void> {
  if (!orderId.trim()) {
    throw new Error("A valid order ID is required.");
  }

  const payload: Record<string, unknown> = {};

  if (updates.orderStatus !== undefined) {
    payload.orderStatus = updates.orderStatus;
  }

  if (updates.trackingNumber !== undefined) {
    payload.trackingNumber = updates.trackingNumber;
  }

  if (updates.deliveryPersonName !== undefined) {
    payload.deliveryPersonName = updates.deliveryPersonName;
  }

  if (updates.deliveryPersonPhone !== undefined) {
    payload.deliveryPersonPhone = updates.deliveryPersonPhone;
  }

  if (updates.estimatedDelivery !== undefined) {
    payload.estimatedDelivery = updates.estimatedDelivery.toISOString();
  }

  if (updates.notes !== undefined) {
    payload.notes = updates.notes;
  }

  if (updates.codPaymentCollected !== undefined) {
    payload.codPaymentCollected = updates.codPaymentCollected;
  }

  const response = await fetch(
    `${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  const result = await readApiResponse<{
    success: boolean;
    message?: string;
  }>(response);

  if (result.success !== true) {
    throw new Error(result.message || "The order update failed.");
  }
}