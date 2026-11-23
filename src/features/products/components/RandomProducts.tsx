import { useEffect, useRef, useState } from "react";

import ProductShelf from "@/components/ui/ProductShelf";

import { useProducts } from "../hooks/useProducts";

const COUNT = 5;

interface RandomProductsProps {
  /** Product details page: the product being viewed. */
  currentProductId?: string;
  /** Cart page: products already in the cart. */
  excludeProductIds?: string[];
  title?: string;
}

export default function RandomProducts({
  currentProductId,
  excludeProductIds,
  title = "You May Also Like",
}: RandomProductsProps) {
  const { data: products = [], isLoading } = useProducts();

  const [pickedIds, setPickedIds] = useState<string[]>([]);

  const hasProducts = products.length > 0;

  // Always holds the latest exclusion list without re-triggering the pick.
  const excludedRef = useRef<Set<string>>(new Set());
  excludedRef.current = new Set([
    ...(excludeProductIds ?? []),
    ...(currentProductId ? [currentProductId] : []),
  ]);

  // Picks again when a page opens (or a different product page opens).
  // It does not re-pick when data refetches in the background,
  // so the row never jumps while someone is looking at it.
  useEffect(() => {
    if (!hasProducts) return;

    const eligible = products.filter(
      (product) => product.isActive && !excludedRef.current.has(product.id),
    );

    // Fisher-Yates shuffle.
    const shuffled = [...eligible];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // In-stock products first, then fill up with the rest.
    const inStock = shuffled.filter((product) => product.stock > 0);
    const outOfStock = shuffled.filter((product) => product.stock <= 0);

    setPickedIds(
      [...inStock, ...outOfStock].slice(0, COUNT).map((product) => product.id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProductId, hasProducts]);

  const picked = pickedIds
    .map((id) => products.find((product) => product.id === id))
    .filter(
      (product): product is NonNullable<typeof product> => Boolean(product),
    );

  return (
    <ProductShelf
      title={title}
      products={picked}
      isLoading={isLoading}
      background="#F5F7FA"
      maxItems={COUNT}
    />
  );
}