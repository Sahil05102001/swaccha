import { auth } from "@/firebase/auth";
import { waitForBackend } from "@/lib/backendWarmup";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutShippingAddress {
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

export interface CreatePaymentOrderRequest {
  items: CheckoutItemInput[];
  shippingAddress: CheckoutShippingAddress;
  couponCode?: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  orderId: string;
  firestoreOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
  orderNumber?: string;
  refundRequired?: boolean;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to continue with payment.");
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
      result?.message ?? "The payment request could not be completed.",
    );
  }

  if (!result || typeof result !== "object") {
    throw new Error("The server returned an invalid response.");
  }

  return result;
}

export const createPaymentOrder = async (
  data: CreatePaymentOrderRequest,
): Promise<CreatePaymentOrderResponse> => {
  await waitForBackend();

  const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result =
    await readApiResponse<CreatePaymentOrderResponse>(response);

  if (
    result.success !== true ||
    typeof result.orderId !== "string" ||
    typeof result.firestoreOrderId !== "string" ||
    typeof result.amount !== "number" ||
    typeof result.keyId !== "string"
  ) {
    throw new Error("The server returned an invalid payment order.");
  }

  return result;
};

const RETRYABLE_STATUS = new Set([502, 503, 504]);

const VERIFY_PENDING_MESSAGE =
  "We are confirming your payment. If money was deducted, your order will appear in My Orders shortly. Please do not pay again.";

export const verifyPayment = async (
  data: VerifyPaymentRequest,
): Promise<VerifyPaymentResponse> => {
  await waitForBackend();

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, attempt * 3000),
      );
    }

    let response: Response;

    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 45_000);

      try {
        response = await fetch(`${API_BASE_URL}/payments/verify`, {
          method: "POST",
          headers: await getAuthHeaders(),
          body: JSON.stringify(data),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timer);
      }
    } catch {
      // Network error or timeout: the server may be waking up. Try again.
      continue;
    }

    if (RETRYABLE_STATUS.has(response.status)) continue;

    const result = await readApiResponse<VerifyPaymentResponse>(response);

    if (result.success !== true) {
      throw new Error(result.message || "Payment verification failed.");
    }

    return result;
  }

  // The webhook will still create the order. Do not tell the customer it failed.
  throw new Error(VERIFY_PENDING_MESSAGE);
};