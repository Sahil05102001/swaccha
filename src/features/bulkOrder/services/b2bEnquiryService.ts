
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface B2BEnquiryRequest {
  name: string;
  businessName: string;
  phone: string;
  email?: string;
  products: string;
  quantity: string;
  message?: string;
}

export interface B2BEnquiryResponse {
  success: boolean;
  message: string;
  enquiryId: string;
}

export const submitB2BEnquiry = async (
  data: B2BEnquiryRequest,
): Promise<B2BEnquiryResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/b2b/enquiries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    let errorMessage = "Failed to submit your bulk enquiry.";

    try {
      const error = await response.json();
      if (typeof error.message === "string") {
        errorMessage = error.message;
      }
    } catch {
      // Keep the default message if the response isn't JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<B2BEnquiryResponse>;
};
