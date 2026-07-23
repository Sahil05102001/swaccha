import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { Order } from "../types/order";

const ordersCollection = collection(db, "orders");

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

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Order, "id">),
  }));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(
    ordersCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Order, "id">),
  }));
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
) {
  const orderData = {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields because Firestore doesn't allow them.
  const cleanedOrderData = Object.fromEntries(
    Object.entries(orderData).filter(
      ([, value]) => value !== undefined
    )
  );

  await addDoc(ordersCollection, cleanedOrderData);
}

export async function getOrderById(
  orderId: string
): Promise<Order> {
  const snapshot = await getDoc(
    doc(db, "orders", orderId)
  );

  if (!snapshot.exists()) {
    throw new Error("Order not found.");
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Order, "id">),
  };
}