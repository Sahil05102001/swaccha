import type { QueryClient } from "@tanstack/react-query";

import { getOrders } from "../services/orderService";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolves once the order is present in the customer's orders list cache
 * (the same data the Orders page shows), so the success page never appears
 * before "My Orders" can show the new order.
 *
 * Normally the first fetch already contains it, so this costs one query.
 * If it still isn't there after ~6 seconds we give up and return false;
 * the order exists on the server, so the caller should carry on.
 */
export async function waitForOrder(
  queryClient: QueryClient,
  orderId: string | undefined,
  { attempts = 8, delayMs = 750 }: { attempts?: number; delayMs?: number } = {},
): Promise<boolean> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // staleTime 0 forces a real fetch and writes the result into the cache.
      const orders = await queryClient.fetchQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
        staleTime: 0,
      });

      // Without an id we can only guarantee the list was refreshed.
      if (!orderId || orders.some((order) => order.id === orderId)) {
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        return true;
      }
    } catch (error) {
      console.error("Could not confirm the order yet:", error);
    }

    if (attempt < attempts - 1) await sleep(delayMs);
  }

  queryClient.invalidateQueries({ queryKey: ["orders"] });
  return false;
}
