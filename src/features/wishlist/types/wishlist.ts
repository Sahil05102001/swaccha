
import type { Product } from "@/features/products/types/product";

/**
 * Wishlist products omit Firestore Timestamp fields so that
 * wishlist data can be stored safely in Redux.
 *
 * The original Product type remains unchanged for the rest
 * of the application.
 */
export type WishlistItem = Omit<
  Product,
  "createdAt" | "updatedAt"
>;
