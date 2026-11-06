import { auth } from "@/firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

async function post(path: string, body: Record<string, unknown>) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(result?.message ?? "The request could not be completed.");
  }

  return result?.message ?? "Done.";
}

export const cancelOrderRequest = (
  orderId: string,
  reason: string,
  asAdmin: boolean,
) =>
  post(
    asAdmin
      ? `/admin/orders/${encodeURIComponent(orderId)}/cancel`
      : `/orders/${encodeURIComponent(orderId)}/cancel`,
    { reason },
  );

export const refundOrderRequest = (
  orderId: string,
  input: { amount?: number; reason: string; restock?: boolean },
) => post(`/admin/orders/${encodeURIComponent(orderId)}/refund`, input);