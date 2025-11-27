import { z } from "zod";
import { addressFieldsValidator } from "./addressValidators";
import { BuildingType } from "../generated/prisma/enums";

export const buildingValidator = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  name: z.string(),
  type: z.enum(BuildingType),
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
});
