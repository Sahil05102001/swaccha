import { auth } from "@/firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export type CouponType = "percent" | "flat" | "freeShipping";
export type CouponPayments = "all" | "online" | "cod";

export interface AppliedCoupon {
  code: string;
  description: string;
  discount: number;
}

export interface CheckoutOffer {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  maxDiscount: number;
  minOrderValue: number;
  paymentMethods: CouponPayments;
  firstOrderOnly: boolean;
}

export interface AdminCoupon extends CheckoutOffer {
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  usageLimit: number;
  perUserLimit: number;
  usedCount: number;
  showAtCheckout: boolean;
}

async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok || !result) {
    throw new Error(result?.message ?? "The request could not be completed.");
  }

  return result;
}

export async function previewCoupon(input: {
  code: string;
  subtotal: number;
  paymentMethod: "cod" | "razorpay";
  shipping: number;
}): Promise<AppliedCoupon> {
  const r = await authFetch<AppliedCoupon & { success: boolean }>(
    "/coupons/preview",
    { method: "POST", body: JSON.stringify(input) },
  );
  return { code: r.code, description: r.description, discount: r.discount };
}

export async function getAvailableCoupons(): Promise<CheckoutOffer[]> {
  const r = await authFetch<{ coupons: CheckoutOffer[] }>("/coupons/available");
  return r.coupons;
}

export async function getAdminCoupons(): Promise<AdminCoupon[]> {
  const r = await authFetch<{ coupons: AdminCoupon[] }>("/admin/coupons");
  return r.coupons;
}

export async function saveAdminCoupon(
  coupon: Record<string, unknown> & { code: string },
  isNew: boolean,
) {
  await authFetch(
    isNew ? "/admin/coupons" : `/admin/coupons/${encodeURIComponent(coupon.code)}`,
    { method: isNew ? "POST" : "PUT", body: JSON.stringify(coupon) },
  );
}

export async function deleteAdminCoupon(code: string) {
  await authFetch(`/admin/coupons/${encodeURIComponent(code)}`, {
    method: "DELETE",
  });
}