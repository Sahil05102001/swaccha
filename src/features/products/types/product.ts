import type { Timestamp } from "firebase/firestore";

export interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    sku: string;
    category: string;
    subcategory: string;
    price: number;
    mrp: number;
    discount: number;
    stock: number;
    unit: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;

    ratingAverage?: number;
    ratingCount?: number;

    createdAt?: Timestamp;
    updatedAt?: Timestamp;
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