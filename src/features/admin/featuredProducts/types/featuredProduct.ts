export interface FeaturedProduct {
    id: string;
    productId: string;
    displayOrder: number;
    isActive: boolean;
}

export interface FeaturedProductFormData {
    productId: string;
    displayOrder: number;
    isActive: boolean;
}

export const MAX_FEATURED_PRODUCTS = 5;

export const DEFAULT_FEATURED_PRODUCT: FeaturedProductFormData = {
    productId: "",
    displayOrder: 1,
    isActive: true,
};