import type { Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "razorpay"
  | "upi";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;

  orderNumber: string;

  userId: string;

  customerName: string;

  customerEmail: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  paymentId?: string;

  orderStatus: OrderStatus;

  subtotal: number;

  shippingCharge: number;

  totalAmount: number;

  // ---------- Admin Fields ----------

  trackingNumber?: string;

  deliveryPersonName?: string;

  deliveryPersonPhone?: string;

  estimatedDelivery?: Timestamp;

  notes?: string;

  // ---------- Timestamps ----------

  createdAt: Timestamp;

  updatedAt: Timestamp;
}