import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { Order } from "../types/order";

const ordersCollection = collection(db, "orders");
const productsCollection = collection(db, "products");

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

export async function getOrdersByUserId(
  userId: string
): Promise<Order[]> {
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

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
) {
  await runTransaction(db, async (transaction) => {
    for (const item of order.items) {
      const productRef = doc(
        productsCollection,
        item.productId
      );

      const productSnapshot =
        await transaction.get(productRef);

      if (!productSnapshot.exists()) {
        throw new Error(
          `${item.name} no longer exists.`
        );
      }

      const product = productSnapshot.data() as {
        stock: number;
      };

      if (product.stock < item.quantity) {
        throw new Error(
          `Only ${product.stock} ${item.name} available in stock.`
        );
      }

      transaction.update(productRef, {
        stock: product.stock - item.quantity,
        updatedAt: Timestamp.now(),
      });
    }

    const orderRef = doc(ordersCollection);

    const orderData = {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const cleanedOrderData = Object.fromEntries(
      Object.entries(orderData).filter(
        ([, value]) => value !== undefined
      )
    );

    transaction.set(orderRef, cleanedOrderData);
  });
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