import { useMemo } from "react";

import { useProducts } from "@/features/products/hooks/useProducts";

import type { CartItem } from "../types/cart";
import { useCart } from "./useCart";

/**
 * The cart, but with each product's price, MRP, stock, name and photos taken
 * from the live product list instead of the copy saved when the item was added.
 *
 * It reads the product list the site has already loaded and cached, so it adds
 * no database reads of its own. Nothing is written back.
 */
export function useLiveCart() {
  const cart = useCart();
  const { data: products } = useProducts();

  const items = useMemo<CartItem[] | undefined>(() => {
    if (!cart.data) return cart.data;
    if (!products || products.length === 0) return cart.data;

    const liveById = new Map(products.map((product) => [product.id, product]));

    return cart.data.map((item) => {
      const live = liveById.get(item.productId);

      // Product not found (for example deleted): keep the saved copy.
      if (!live) return item;

      return {
        ...item,
        product: { ...item.product, ...live },
      };
    });
  }, [cart.data, products]);

  return { ...cart, data: items };
}