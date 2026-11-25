import { z } from "zod";

import {
  getPasswordChecks,
} from "../utils/passwordRules";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Name must be at least 3 characters"),

    email: z
      .email("Enter a valid email"),

    password: z
      .string()
      .min(1, "Enter a password")
      .superRefine((value, ctx) => {
        const missing = getPasswordChecks(value).filter(
          (check) => !check.met && check.id !== "personal",
        );

        if (missing.length > 0) {
          ctx.addIssue({
            code: "custom",
            message: `Password needs: ${missing
              .map((check) => check.short)
              .join(", ")}`,
          });
        }
      }),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      getPasswordChecks(data.password, {
        email: data.email,
        fullName: data.fullName,
      }).find((check) => check.id === "personal")?.met !== false,
    {
      message: "Password must not contain your name or email",
      path: ["password"],
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;