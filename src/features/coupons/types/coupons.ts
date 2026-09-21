export type CouponType =
  | "flat"
  | "percentage";

export interface Coupon {
  id: string;

  code: string;

  type: CouponType;

  value: number;

  minimumOrder: number;

  expiryDate: Date;

  isActive: boolean;

  createdAt: Date | null;

  updatedAt: Date | null;
}