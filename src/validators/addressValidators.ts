import { z } from "zod";

export const addressValidator = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  buildingId: z.string().uuid("Invalid property ID"),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
});

export const updateAddressValidator = z.object({
  street: z.string().min(1, "Street is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  postalCode: z.string().min(1, "Postal code is required").optional(),
  country: z.string().min(1, "Country is required").optional(),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
});
