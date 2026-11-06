
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addWishlistItem,
  getWishlistItems,
  removeWishlistItem,
} from "../services/wishlistService";

import type { Product } from "@/features/products/types/product";

export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistItems,
    enabled,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Product) => addWishlistItem(product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      removeWishlistItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });
}
