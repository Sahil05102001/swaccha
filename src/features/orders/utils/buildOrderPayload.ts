import type { PaymentMethod, PaymentStatus } from "../types/order";

import type { OrderItem, ShippingAddress } from "../types/order";

interface BuildOrderPayloadParams {
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
}

export default function buildOrderPayload({
  orderNumber,
  userId,
  customerName,
  customerEmail,
  items,
  shippingAddress,
  paymentMethod,
  paymentStatus,
  paymentId,
  subtotal,
  shippingCharge,
  totalAmount,
}: BuildOrderPayloadParams) {
  return {
    orderNumber,
    userId,
    customerName,
    customerEmail,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    paymentId,
    orderStatus: "pending" as const,
    subtotal,
    shippingCharge,
    totalAmount,
    trackingNumber: undefined,
    notes: undefined,
  };
}