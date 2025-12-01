import { z } from "zod";

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
  type: z
    .string()
    .min(2, "Minimun of two characters is required for Unit type"),
  status: z
    .enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
    .default("AVAILABLE"),
  rentAmount: z.number().positive("Rent amount must be a positive number"),
  depositAmount: z
    .number()
    .nonnegative("Deposit amount must be a non-negative number")
    .optional(),
  buildingId: z.string().uuid("Invalid building ID"),
  occupantId: z.uuid("Invalid Occupant ID").optional(),
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
  occupantId: z.uuid("Invalid Occupant ID").optional(),
});
