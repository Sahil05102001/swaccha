import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/productService";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    // Edits and deletes invalidate this key, so a long cache is safe.
    staleTime: 5 * 60_000,
  });
}