import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { getAllOrders } from "@/features/orders/services/orderService";
import type {
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order";

export async function getAdminOrders() {
  return getAllOrders();
}

export async function updateAdminOrderStatus(
  orderId: string,
  orderStatus: OrderStatus
) {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    orderStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateAdminPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}