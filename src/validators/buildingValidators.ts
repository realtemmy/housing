import { z } from "zod";
import { addressFieldsValidator } from "./addressValidators";

export const buildingValidator = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  name: z.string(),
  floors: z.number().int().positive("Floors must be a positive integer").optional(),
  address: addressFieldsValidator,
});

export const updateBuildingValidator = z.object({
  name: z.string().optional(),
  floors: z.number().int().positive("Floors must be a positive integer").optional(),
});
