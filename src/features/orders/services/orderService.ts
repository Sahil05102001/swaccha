import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { Order } from "../types/order";

const ordersCollection = collection(db, "orders");

/**
 * A Razorpay order is saved before the customer pays. If they close the
 * payment popup, it stays "pending". These are not real orders, so neither
 * customers nor admins should see them. COD orders are also "pending" but
 * are real, so only Razorpay is filtered.
 */
export function isUnpaidRazorpayOrder(
  order: Pick<Order, "paymentMethod" | "paymentStatus">
): boolean {
  return (
    order.paymentMethod === "razorpay" && order.paymentStatus === "pending"
  );
}

export async function getOrders(): Promise<Order[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const q = query(
    ordersCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Order, "id">),
    }))
    .filter((order) => !isUnpaidRazorpayOrder(order));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(ordersCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Order, "id">),
    }))
    .filter((order) => !isUnpaidRazorpayOrder(order));
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const q = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Order, "id">),
  }));
}

export async function getOrderById(orderId: string): Promise<Order> {
  const snapshot = await getDoc(doc(db, "orders", orderId));

  if (!snapshot.exists()) {
    throw new Error("Order not found.");
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Order, "id">),
  };
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: Order["orderStatus"]
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    orderStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order["paymentStatus"]
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderShippingDetails(
  orderId: string,
  data: {
    trackingNumber?: string;
    deliveryPersonName?: string;
    deliveryPersonPhone?: string;
    estimatedDelivery?: Timestamp;
    notes?: string;
  }
): Promise<void> {
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  await updateDoc(doc(db, "orders", orderId), {
    ...cleanedData,
    updatedAt: serverTimestamp(),
  });
}