
import { auth } from "@/firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface B2BEnquiryCounts {
  success: boolean;
  totalEnquiries: number;
  enquiriesToday: number;
}

export async function getB2BEnquiryCounts(): Promise<B2BEnquiryCounts> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to view B2B enquiry statistics.");
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_BASE_URL}/admin/b2b-enquiries/counts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    let message = "Failed to load B2B enquiry statistics.";

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

  return response.json() as Promise<B2BEnquiryCounts>;
}
