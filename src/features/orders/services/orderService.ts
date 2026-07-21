import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";
import type { Order } from "../types/order";

function getOrderCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  return collection(db, "users", user.uid, "orders");
}

export async function getOrders(): Promise<Order[]> {
  const q = query(
    getOrderCollection(),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
) {
  await addDoc(getOrderCollection(), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}