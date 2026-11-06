export type AuthNoticeSeverity = "error" | "warning" | "info";

const NETWORK = "Unable to connect. Please check your internet connection.";

const MESSAGES: Record<string, { message: string; severity?: AuthNoticeSeverity }> = {
  // Modern Firebase returns invalid-credential for both a wrong password and
  // an unknown email, so one message covers both.
  "auth/invalid-credential": {
    message: "Incorrect email or password. Please try again.",
  },
  "auth/wrong-password": {
    message: "Incorrect email or password. Please try again.",
  },
  "auth/invalid-login-credentials": {
    message: "Incorrect email or password. Please try again.",
  },
  "auth/user-not-found": { message: "No account found with this email." },
  "auth/email-already-in-use": {
    message: "An account with this email already exists.",
  },
  "auth/weak-password": { message: "Please choose a stronger password." },
  "auth/invalid-email": { message: "Please enter a valid email address." },
  "auth/too-many-requests": {
    message: "Too many attempts. Please try again later.",
  },
  "auth/network-request-failed": { message: NETWORK },
  "auth/user-disabled": {
    message: "This account has been disabled. Please contact support.",
  },
  "auth/popup-closed-by-user": {
    message: "Google sign-in was cancelled.",
    severity: "info",
  },
  "auth/cancelled-popup-request": {
    message: "Google sign-in was cancelled.",
    severity: "info",
  },
  "auth/popup-blocked": {
    message: "Your browser blocked the sign-in window. Please allow pop-ups and try again.",
    severity: "warning",
  },
  "auth/account-exists-with-different-credential": {
    message:
      "An account already exists with this email using a different sign-in method.",
    severity: "warning",
  },
  "auth/unauthorized-domain": {
    message: "Sign-in isn't available on this website address right now.",
  },
  // Firestore errors seen right after signing in.
  unavailable: { message: NETWORK },
};

/** Turns any sign-in or sign-up error into a customer-friendly notice. */
export function describeAuthError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): { message: string; severity: AuthNoticeSeverity } {
  const code = (error as { code?: string } | null)?.code ?? "";
  const match = MESSAGES[code];

  if (match) {
    return { message: match.message, severity: match.severity ?? "error" };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { message: NETWORK, severity: "error" };
  }

  // Never show raw Firebase codes or technical messages.
  return { message: fallback, severity: "error" };
}