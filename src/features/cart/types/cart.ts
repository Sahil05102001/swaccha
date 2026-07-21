import type { Timestamp } from "firebase/firestore";

import type { Product } from "@/features/products/types/product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}