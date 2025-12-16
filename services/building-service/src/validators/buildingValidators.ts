import { z } from "zod";
import { addressFieldsValidator } from "./addressValidators";
import { BuildingType } from "../generated/prisma/enums";

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
  type: z.enum(BuildingType),
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
