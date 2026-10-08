import { z } from "zod";

export const propertyValidator = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .max(1000, "Description should not exceed 1000 characters")
    .optional()
    .nullable(),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }).optional(),
  purchasePrice: z.number().min(0, "Purchase price must be positive").optional(),
  currentValue: z.number().min(0, "Current value must be positive").optional(),
});

export const updatePropertyValidator = z.object({
  title: z.string().min(1, "Title must not be empty").max(200, "Title must not exceed 200 characters").optional(),
  description: z
    .string()
    .max(1000, "Description should not exceed 1000 characters")
    .optional()
    .nullable(),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }).optional(),
  purchasePrice: z.number().min(0, "Purchase price must be positive").optional(),
  currentValue: z.number().min(0, "Current value must be positive").optional(),
  verificationStatus: z.enum(["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"]).optional(),
  verificationNotes: z.string().max(500, "Verification notes must not exceed 500 characters").optional(),
  isActive: z.boolean().optional(),
});