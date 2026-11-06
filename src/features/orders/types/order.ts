
import type { Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "razorpay"
  | "upi";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethodType =
  | "upi"
  | "card"
  | "netbanking"
  | "wallet"
  | "emi"
  | "paylater"
  | "other";

export type PaymentProvider =
  | "razorpay"
  | "other";

export interface OrderRefund {
  id: string;
  amount: number;
  reason: string;
  status: "initiated" | "pending" | "processed" | "failed";
  source?: "app" | "dashboard" | "manual";
  by: string;
  razorpayRefundId?: string;
  failureReason?: string;
  createdAt: Timestamp;
}

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
  // Delivery pin chosen on the map. Missing on orders placed before pins existed.
  latitude?: number;
  longitude?: number;
  // GPS accuracy in metres (only when the pin came from device GPS).
  locationAccuracy?: number;
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
  paymentMethodType?: PaymentMethodType | string;
  paymentProvider?: PaymentProvider | string;
  paymentStatus: PaymentStatus;
  paymentId?: string;

  orderStatus: OrderStatus;

  discount?: number;
  couponCode?: string;

  shippingDistanceKm?: number;

  subtotal: number;
  shippingCharge: number;
  totalAmount: number;

  refunds?: OrderRefund[];
  refundRequired?: boolean;
  cancelledAt?: Timestamp;
  cancelledBy?: string;
  cancelReason?: string;

  returnedAt?: Timestamp;
  returnStockRestored?: boolean;

  // Admin Fields
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Timestamp;
  deliveredAt?: Timestamp;
  codCollectedAt?: Timestamp; // when the admin confirmed the COD cash was collected
  notes?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
