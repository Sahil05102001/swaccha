import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/firebase/auth";
import { waitForBackend } from "@/lib/backendWarmup";

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5000"
).replace(/\/+$/, "");

async function callApi(
  path: string,
  method: "PATCH" | "POST",
  body: unknown,
): Promise<void> {
  await waitForBackend();

  const user = auth.currentUser;

  if (!user) throw new Error("You must be signed in as an administrator.");

  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message ?? "The request could not be completed.");
  }
}

export const setCustomerActive = (uid: string, active: boolean) =>
  callApi(`/admin/customers/${encodeURIComponent(uid)}/status`, "PATCH", {
    active,
  });

export const deleteCustomerAccount = (uid: string) =>
  callApi(`/admin/customers/${encodeURIComponent(uid)}/delete`, "POST", {
    confirm: "DELETE",
  });

/** Emails the customer a link to choose a new password. */
export const sendCustomerPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email);