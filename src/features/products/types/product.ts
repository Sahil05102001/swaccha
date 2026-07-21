import type { Timestamp } from "firebase/firestore";

export interface Product {
    id: string;

    // Basic Information
    name: string;
    description: string;
    brand: string;
    sku: string;

    // Category
    category: string;
    subcategory: string;

    // Pricing
    price: number;
    mrp: number;
    discount: number;

    // Inventory
    stock: number;
    unit: string;

    // Images
    images: string[];

    // Status
    isActive: boolean;
    isFeatured: boolean;

    // Metadata
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}