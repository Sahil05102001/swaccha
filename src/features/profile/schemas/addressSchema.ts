import { z } from "zod";

export const addressSchema = z.object({
  label: z.enum(["Home", "Office", "Other"]),

  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters."),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),

  addressLine1: z
    .string()
    .trim()
    .min(5, "Address Line 1 is required."),

  addressLine2: z
    .string()
    .trim()
    .optional(),

  landmark: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City is required."),

  state: z
    .string()
    .trim()
    .min(2, "State is required."),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),

  country: z
  .string()
  .trim()
  .min(1, "Country is required."),

  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;