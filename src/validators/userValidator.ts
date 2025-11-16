import { z } from "zod";

export const userValidator = z.object({
  email: z.email({ error: "Please input a valid email" }),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  password: z.string().min(8, "Password should not be less then 8 characters"),
  name: z
    .string()
    .min(2, "Name should not be less than 2 characters")
    .max(10, "Name shouldnotbe more than 100 characters"),
  phone: z
    .string()
    .min(10, "Phone number should not be less than 10 digits")
    .optional(),
  bio: z.string().max(1500, "Maximum length of 1500 exceeded").optional(),
  photo: z.url().optional(),
});
