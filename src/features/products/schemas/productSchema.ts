import { z } from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Product name must be at least 3 characters."),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters."),

    brand: z
        .string()
        .trim()
        .min(2, "Brand is required."),

    sku: z
        .string()
        .trim()
        .min(3, "SKU is required."),

    category: z
        .string()
        .min(1, "Please select a category."),

    subcategory: z
        .string()
        .min(1, "Please select a subcategory."),

    price: z
        .number()
        .positive("Price must be greater than 0."),

    mrp: z
        .number()
        .positive("MRP must be greater than 0."),

    discount: z
        .number()
        .min(0, "Discount cannot be negative.")
        .max(100, "Discount cannot exceed 100%."),

    stock: z
        .number()
        .int("Stock must be a whole number.")
        .min(0, "Stock cannot be negative."),

    unit: z
        .string()
        .trim()
        .min(1, "Unit is required."),

    images: z
        .array(z.string().url("Invalid image URL."))
        .min(1, "At least one product image is required."),

    isActive: z.boolean(),

    isFeatured: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;