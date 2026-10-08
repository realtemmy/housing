import { z } from "zod";

export const leaseRenewalValidator = z.object({
  leaseId: z.string().min(1, "Lease ID is required"),
  newStart: z.string().datetime("New start date must be a valid datetime"),
  newEnd: z.string().datetime("New end date must be a valid datetime"),
  newRent: z.number().min(0, "New rent amount must be zero or positive").optional(),
  approved: z.boolean().optional().default(true),
  notes: z.string().optional().nullable(),
});

export const updateLeaseRenewalValidator = z.object({
  newStart: z.string().datetime("New start date must be a valid datetime").optional(),
  newEnd: z.string().datetime("New end date must be a valid datetime").optional(),
  newRent: z.number().min(0, "New rent amount must be zero or positive").optional(),
  approved: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});