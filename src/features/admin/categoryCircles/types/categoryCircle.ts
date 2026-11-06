export interface CategoryCircle {
  id: string;

  label: string;

  imageUrl?: string;

  imagePublicId?: string;

  icon: string;

  href: string;

  sortOrder: number;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CategoryCircleFormData {
  label: string;

  imageUrl?: string;

  imagePublicId?: string;

  icon: string;

  href: string;

  sortOrder: number;

  isActive: boolean;
}

export const DEFAULT_CATEGORY_CIRCLE: CategoryCircleFormData = {
  label: "",
  imageUrl: "",
  imagePublicId: "",
  icon: "Category",
  href: "/products",
  sortOrder: 1,
  isActive: true,
};