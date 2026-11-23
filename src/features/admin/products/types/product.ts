
import type { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  sku: string;
  category: string;
  subcategory: string;
  productSize?: number;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  unit: string;
  images: string[];
  imagePublicId?: string;
  isActive: boolean;
  isFeatured: boolean;
  badgeMode?: "none" | "global" | "custom";
  badgeText?: string;
  hsnCode?: string;
  gstRate?: number;
  // Maintained by the review system. Average = ratingSum / ratingCount.
  ratingSum?: number;
  ratingCount?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  sku: string;
  category: string;
  subcategory: string;
  productSize: number | "";
  unit: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  imagePublicId?: string;
  isActive: boolean;
  badgeMode?: "none" | "global" | "custom";
  badgeText?: string;
  // Optional. Used on tax invoices while GST is on.
  hsnCode?: string;
  gstRate?: number | "";
}

export interface ProductSticker {
  isEnabled: boolean;
  text: string;
}

export interface RotatingProductSticker {
  isEnabled: boolean;
  texts: string[];
  intervalSeconds: number;
}
