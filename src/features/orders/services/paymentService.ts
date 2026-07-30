const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface CreatePaymentOrderRequest {
  amount: number;
  receipt: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  orderId: string;
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
}

export const createPaymentOrder = async (
  data: CreatePaymentOrderRequest,
): Promise<CreatePaymentOrderResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/payments/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message ?? "Failed to create payment order.",
    );
  }

  return response.json();
};

export const verifyPayment = async (
  data: VerifyPaymentRequest,
): Promise<VerifyPaymentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/payments/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message ?? "Payment verification failed.",
    );
  }

  return response.json();
};