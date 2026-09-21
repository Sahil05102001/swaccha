export interface BestSeller {
  id: string;

  productId: string;

  sortOrder: number;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface BestSellerFormData {
  productId: string;

  sortOrder: number;

  isActive: boolean;
}

export const DEFAULT_BEST_SELLER: BestSellerFormData = {
  productId: "",

  sortOrder: 1,

  isActive: true,
};