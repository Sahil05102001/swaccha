
import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required"),

    brand: z
      .string()
      .trim()
      .optional(),

    sku: z
      .string()
      .trim()
      .min(3, "SKU must be at least 3 characters"),

    category: z
      .string()
      .trim()
      .min(1, "Please select a category"),

    subcategory: z
      .string()
      .trim()
      .optional(),

    // Optional product size. Decimal values are supported.
    productSize: z.union([
      z.literal(""),
      z
        .number()
        .finite("Product size must be a valid number")
        .gt(0, "Product size must be greater than 0"),
    ]),

    unit: z
      .string()
      .trim()
      .min(1, "Please select a unit"),

    // Actual price charged to the customer.
    price: z
      .number()
      .finite("Selling price must be a valid number")
      .gt(0, "Selling price must be greater than 0"),

    // Original maximum retail price.
    mrp: z
      .number()
      .finite("MRP must be a valid number")
      .min(0, "MRP cannot be negative"),

    stock: z
      .number()
      .finite("Stock must be a valid number")
      .min(0, "Stock cannot be negative"),

    images: z
      .array(z.string().url("Invalid image URL"))
      .min(1, "Please upload at least one product image"),

    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.mrp < data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mrp"],
        message: "MRP must be greater than or equal to the selling price",
      });
    }
  });

export type ProductSchema = z.infer<typeof productSchema>;
