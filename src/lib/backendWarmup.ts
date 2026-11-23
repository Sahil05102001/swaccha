const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const FRESH_MS = 4 * 60 * 1000;

let lastAwakeAt = 0;
let inFlight: Promise<boolean> | null = null;

async function ping(timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Wakes the server quietly. Safe to call often: it runs at most every 4 min. */
export function warmBackend(): void {
  if (inFlight || Date.now() - lastAwakeAt < FRESH_MS) return;

  inFlight = ping(60_000)
    .then((ok) => {
      if (ok) lastAwakeAt = Date.now();
      return ok;
    })
    .finally(() => {
      inFlight = null;
    });
}

/** Waits (up to maxWaitMs) until the server answers. Never throws. */
export async function waitForBackend(maxWaitMs = 60_000): Promise<void> {
  if (Date.now() - lastAwakeAt < FRESH_MS) return;

  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const ok = inFlight
      ? await inFlight
      : await ping(Math.min(20_000, deadline - Date.now()));

    if (ok) {
      lastAwakeAt = Date.now();
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 2000));
  }
}