import { auth } from "@/firebase/auth";
import { waitForBackend } from "@/lib/backendWarmup";

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5000"
).replace(/\/+$/, "");

export async function deleteMyAccount(): Promise<void> {
  await waitForBackend();

  const user = auth.currentUser;

  if (!user) throw new Error("Please sign in again.");

  // Fresh token: the server checks that the login is very recent.
  const idToken = await user.getIdToken(true);

  const response = await fetch(`${API_BASE_URL}/account/delete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirm: "DELETE" }),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.message ?? "Your account could not be deleted. Please try again.",
    );
  }
}