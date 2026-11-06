
import { auth } from "@/firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface CodCheckoutItem {
  productId: string;
  quantity: number;
}

export interface CodShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Delivery pin chosen on the map (required by the server).
  latitude: number;
  longitude: number;
  // GPS accuracy in metres. Only present when the pin came from device GPS.
  locationAccuracy?: number;
}

export interface CreateCodOrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
}

export async function createCodCheckoutOrder(data: {
  items: CodCheckoutItem[];
  shippingAddress: CodShippingAddress;
  couponCode?: string;
}): Promise<CreateCodOrderResponse> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in before placing your order.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}/orders/cod`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json().catch(() => null)) as
    | (Partial<CreateCodOrderResponse> & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(
      result?.message ?? "Unable to place your COD order.",
    );
  }

  if (
    !result ||
    result.success !== true ||
    typeof result.orderId !== "string"
  ) {
    throw new Error("The server returned an invalid order response.");
  }

  return result as CreateCodOrderResponse;
}
