import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addWishlistItem,
  getWishlistIds,
  removeWishlistItem,
} from "../services/wishlistService";

import { useProducts } from "@/features/products/hooks/useProducts";

import type { Product } from "@/features/products/types/product";
import type { WishlistItem } from "../types/wishlist";

/**
 * The customer's saved products. Only the saved ids are read from Firestore;
 * product details come from the product list the site already caches, so
 * opening the wishlist no longer reads every product again.
 */
export function useWishlist(enabled = true) {
  const idsQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistIds,
    enabled,
  });

  const productsQuery = useProducts();

  const items = useMemo<WishlistItem[]>(() => {
    const ids = idsQuery.data ?? [];
    const products = productsQuery.data ?? [];

    if (ids.length === 0 || products.length === 0) return [];

    const byId = new Map(products.map((product) => [product.id, product]));

    return ids
      .map((id) => byId.get(id))
      .filter((product): product is Product => Boolean(product)) as WishlistItem[];
  }, [idsQuery.data, productsQuery.data]);

  return {
    ...idsQuery,
    data: items,
    isLoading:
      idsQuery.isLoading || (idsQuery.data?.length ? productsQuery.isLoading : false),
    isError: idsQuery.isError,
    error: idsQuery.error,
  };
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