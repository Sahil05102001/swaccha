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

interface UpdateAdminOrderInput {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export async function updateAdminOrder(
  orderId: string,
  updates: UpdateAdminOrderInput
) {
  const orderRef = doc(db, "orders", orderId);

  const dataToUpdate: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.orderStatus !== undefined) {
    dataToUpdate.orderStatus = updates.orderStatus;
  }

  if (updates.paymentStatus !== undefined) {
    dataToUpdate.paymentStatus = updates.paymentStatus;
  }

  if (updates.trackingNumber !== undefined) {
    dataToUpdate.trackingNumber = updates.trackingNumber;
  }

  if (updates.deliveryPersonName !== undefined) {
    dataToUpdate.deliveryPersonName =
      updates.deliveryPersonName;
  }

  if (updates.deliveryPersonPhone !== undefined) {
    dataToUpdate.deliveryPersonPhone =
      updates.deliveryPersonPhone;
  }

  if (updates.estimatedDelivery !== undefined) {
    dataToUpdate.estimatedDelivery =
      updates.estimatedDelivery;
  }

  if (updates.notes !== undefined) {
    dataToUpdate.notes = updates.notes;
  }

  await updateDoc(orderRef, dataToUpdate);
}