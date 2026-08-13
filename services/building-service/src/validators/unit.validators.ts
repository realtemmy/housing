import { z } from "zod";
import { UnitType } from "../generated/prisma/client";

export const unitValidator = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  floor: z.number().int().optional(),
  bedrooms: z
    .number()
    .int()
    .nonnegative("Bedrooms must be a non-negative integer")
    .optional(),
  bathrooms: z
    .number()
    .nonnegative("Bathrooms must be a non-negative number")
    .optional(),
  sqft: z
    .number()
    .int()
    .positive("Square footage must be a positive integer")
    .optional(),
  type: z.nativeEnum(UnitType).optional().default("APARTMENT"),
  status: z
    .enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
    .default("AVAILABLE"),
  rentAmount: z.number().positive("Rent amount must be a positive number").optional(),
  depositAmount: z
    .number()
    .nonnegative("Deposit amount must be a non-negative number")
    .optional(),
  buildingId: z.string().uuid("Invalid building ID"),
  propertyId: z.string().uuid("Invalid property ID").optional(),
  occupantId: z.string().uuid("Invalid Occupant ID").optional(),
});

export const updateUnitValidator = z.object({
  unitNumber: z.string().min(1, "Unit number is required").optional(),
  floor: z.number().int().optional(),
  bedrooms: z
    .number()
    .int()
    .nonnegative("Bedrooms must be a non-negative integer")
    .optional(),
  bathrooms: z
    .number()
    .nonnegative("Bathrooms must be a non-negative number")
    .optional(),
  sqft: z
    .number()
    .int()
    .positive("Square footage must be a positive integer")
    .optional(),
  type: z.nativeEnum(UnitType).optional(),
  status: z
    .enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
    .optional(),
  rentAmount: z
    .number()
    .positive("Rent amount must be a positive number")
    .optional(),
  depositAmount: z
    .number()
    .nonnegative("Deposit amount must be a non-negative number")
    .optional(),
  buildingId: z.string().uuid("Invalid building ID").optional(),
  occupantId: z.string().uuid("Invalid Occupant ID").optional(),
});
