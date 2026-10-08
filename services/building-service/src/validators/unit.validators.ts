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
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional(),
  buildingId: z.string().min(1, "Building ID is required").optional(),
  propertyId: z.string().min(1, "Property ID is required").optional(),
  occupantId: z.string().optional(),
});

export const updateUnitValidator = z.object({
  unitNumber: z.string().min(1, "Unit number must not be empty").optional(),
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
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional(),
  buildingId: z.string().optional(),
  propertyId: z.string().optional(),
  occupantId: z.string().optional(),
  verified: z.boolean().optional(),
});