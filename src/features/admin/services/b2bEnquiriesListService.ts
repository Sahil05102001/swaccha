
import { auth } from "@/firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface B2BEnquiry {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email?: string;
  products: string;
  quantity: string;
  message?: string;
  status: string;
  createdAt?: {
    _seconds?: number;
    seconds?: number;
  } | null;
}

export interface B2BEnquiriesPage {
  enquiries: B2BEnquiry[];
  nextCursor: string | null;
  previousCursor: string | null;
}

interface B2BEnquiriesResponse {
  success: boolean;
  enquiries: B2BEnquiry[];
  nextCursor: string | null;
  previousCursor: string | null;
}

export async function getB2BEnquiries(
  cursor?: string,
  direction: "next" | "previous" = "next",
): Promise<B2BEnquiriesPage> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to view B2B enquiries.");
  }

  const token = await user.getIdToken();

  const params = new URLSearchParams();

  if (cursor) {
    params.set("cursor", cursor);
    params.set("direction", direction);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/admin/b2b-enquiries${queryString ? `?${queryString}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    let message = "Failed to load B2B enquiries.";

    try {
      const error = await response.json();

      if (typeof error.message === "string") {
        message = error.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  const result =
    (await response.json()) as B2BEnquiriesResponse;

  return {
    enquiries: result.enquiries,
    nextCursor: result.nextCursor,
    previousCursor: result.previousCursor,
  };
}
