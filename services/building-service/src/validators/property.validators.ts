import { z } from "zod";

export const propertyValidator = z.object({
  title: z.string(),
  description: z
    .string()
    .max(150, "Description should not ne more than 150 words.")
    .optional(),
});

export const updatePropertyValidator = z.object({
  title: z.string().optional(),
  description: z
    .string()
    .max(150, "Description should not ne more than 150 words.")
    .optional(),
});
