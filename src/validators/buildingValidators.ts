import { z } from "zod";

export const buildingValidator = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  name: z.string().optional(),
  floors: z.number().int().positive("Floors must be a positive integer").optional(),
});

export const updateBuildingValidator = z.object({
  name: z.string().optional(),
  floors: z.number().int().positive("Floors must be a positive integer").optional(),
});
