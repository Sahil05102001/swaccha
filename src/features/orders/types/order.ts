export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
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

  userId: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  subtotal: number;

  shippingCharge: number;

  totalAmount: number;

  createdAt?: unknown;

  updatedAt?: unknown;
}