import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  category: z
    .string()
    .trim()
    .min(1, "Please select a category"),

  price: z
    .number()
    .gt(0, "Price must be greater than 0"),

  stock: z
    .number()
    .min(0, "Stock cannot be negative"),

  images: z
    .array(
      z.string().url("Invalid image URL")
    )
    .min(1, "Please upload at least one product image"),

  isActive: z.boolean(),
});

export type ProductSchema = z.infer<
  typeof productSchema
>;