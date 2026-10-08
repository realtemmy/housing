import { z } from "zod";
import { addressFieldsValidator } from "./address.validators";

export const buildingValidator = z.object({
  propertyId: z.string(), // Changed from uuid to string to match Prisma schema
  name: z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
  description: z
    .string()
    .max(500, "Description should not exceed 500 characters")
    .optional()
    .nullable(),
  summary: z.string().max(500, "Summary should not exceed 500 characters").optional(),
  floors: z
    .number()
    .int()
    .min(0, "Floors must be zero or positive")
    .optional(),
  address: addressFieldsValidator,
});

export const updateBuildingValidator = z.object({
  name: z.string().min(1, "Name must not be empty").max(200, "Name must not exceed 200 characters").optional(),
  description: z
    .string()
    .max(500, "Description should not exceed 500 characters")
    .optional()
    .nullable(),
  summary: z.string().max(500, "Summary should not exceed 500 characters").optional(),
  floors: z
    .number()
    .int()
    .min(0, "Floors must be zero or positive")
    .optional(),
  verified: z.boolean().optional(),
});