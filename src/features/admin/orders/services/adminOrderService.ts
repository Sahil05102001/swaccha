
import { auth } from "@/firebase/auth";
import { getAllOrders } from "@/features/orders/services/orderService";
import type { OrderStatus } from "@/features/orders/types/order";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export async function getAdminOrders() {
  return getAllOrders();
}

interface UpdateAdminOrderInput {
  orderStatus?: OrderStatus;
  trackingNumber?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  estimatedDelivery?: Date;
  notes?: string;
  codPaymentCollected?: boolean;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to manage orders.");
  }

  const idToken = await user.getIdToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(
      result?.message ?? "The order update could not be completed.",
    );
  }

  if (!result || typeof result !== "object") {
    throw new Error("The server returned an invalid response.");
  }

  return result;
}

export async function updateAdminOrder(
  orderId: string,
  updates: UpdateAdminOrderInput,
): Promise<void> {
  if (!orderId.trim()) {
    throw new Error("A valid order ID is required.");
  }

  const payload: Record<string, unknown> = {};

  if (updates.orderStatus !== undefined) {
    payload.orderStatus = updates.orderStatus;
  }

  if (updates.trackingNumber !== undefined) {
    payload.trackingNumber = updates.trackingNumber;
  }

  if (updates.deliveryPersonName !== undefined) {
    payload.deliveryPersonName = updates.deliveryPersonName;
  }

  if (updates.deliveryPersonPhone !== undefined) {
    payload.deliveryPersonPhone = updates.deliveryPersonPhone;
  }

  if (updates.estimatedDelivery !== undefined) {
    payload.estimatedDelivery = updates.estimatedDelivery.toISOString();
  }

  if (updates.notes !== undefined) {
    payload.notes = updates.notes;
  }

  if (updates.codPaymentCollected !== undefined) {
    payload.codPaymentCollected = updates.codPaymentCollected;
  }

  const response = await fetch(
    `${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  const result = await readApiResponse<{
    success: boolean;
    message?: string;
  }>(response);

  if (result.success !== true) {
    throw new Error(result.message || "The order update failed.");
  }
}
