import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  adjustStockRequest,
  fetchStockPage,
  fetchStockSummary,
  type StockFilters,
} from "../services/stockService";

export function useStockMovements(filters: StockFilters) {
  return useInfiniteQuery({
    queryKey: ["stock-movements", filters],
    queryFn: ({ pageParam }) => fetchStockPage(filters, pageParam),
    initialPageParam: null as Parameters<typeof fetchStockPage>[1],
    getNextPageParam: (page) => (page.hasMore ? page.last : undefined),
    staleTime: 60_000,
    retry: false,
  });
}

export function useStockSummary(filters: StockFilters) {
  // The summary ignores the type filter, so changing it costs nothing.
  const { productId, from, to } = filters;
  return useQuery({
    queryKey: ["stock-summary", productId, from, to],
    queryFn: () => fetchStockSummary({ ...filters, movementType: "" }),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustStockRequest,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stock-movements"] }),
        queryClient.invalidateQueries({ queryKey: ["stock-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]),
  });
}