import { z } from "zod";

export const userValidator = z.object({
  firstName: z.string().min(2, "First name cannot be less than two characters"),
  lastName: z.string().min(2, "Last name cannot be more than 2 characters"),
  email: z.email({ error: "Please input a valid email" }),
  role: z.enum(["USER", "OWNER"]).default("USER"),
  password: z.string().min(8, "Password should not be less then 8 characters"),
  username: z
    .string()
    .min(2, "Username should not be less than 2 characters")
    .max(10, "Username shouldnotbe more than 100 characters"),
});
