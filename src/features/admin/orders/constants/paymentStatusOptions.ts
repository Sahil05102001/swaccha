import type { PaymentStatus } from "@/features/orders/types/order";

export const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
];