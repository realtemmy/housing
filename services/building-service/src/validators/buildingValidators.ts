import { z } from "zod";
import { addressFieldsValidator } from "./addressValidators";

export const buildingValidator = z.object({
  propertyId: z.uuid("Invalid property ID"),
  name: z.string(),
  description: z
    .string()
    .max(200, "Description should nor exceed 200 characters")
    .optional(),
  summary: z.string().optional(),
  floors: z
    .number()
    .int()
    .positive("Floors must be a positive integer")
    .optional(),
  address: addressFieldsValidator,
});

export const updateBuildingValidator = z.object({
  name: z.string().optional(),
  floors: z
    .number()
    .int()
    .positive("Floors must be a positive integer")
    .optional(),
  propertyId: z.uuid(),
  description: z.string().optional(),
  summary: z.string().optional(),
});
