import { z } from "zod";
import { LeaseStatus, PaymentFrequency, RentableType } from "../generated/prisma/client";

export const leaseValidator = z.object({
  rentableId: z.string().min(1, "Rentable ID is required"),
  rentableType: z.nativeEnum(RentableType),
  tenantId: z.string().min(1, "Tenant ID is required"),
  rentAmount: z.number().min(0, "Rent amount must be zero or positive"),
  securityDeposit: z.number().min(0, "Security deposit must be zero or positive").optional().default(0),
  serviceCharge: z.number().min(0, "Service charge must be zero or positive").optional().default(0),
  paymentFrequency: z.nativeEnum(PaymentFrequency).optional(),
  actualMoveInDate: z.string().datetime().optional(),
  agreementUrl: z.string().url().optional().nullable(),
});

export const updateLeaseValidator = z.object({
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional(),
  securityDeposit: z.number().min(0, "Security deposit must be zero or positive").optional(),
  serviceCharge: z.number().min(0, "Service charge must be zero or positive").optional(),
  paymentFrequency: z.nativeEnum(PaymentFrequency).optional(),
  status: z.nativeEnum(LeaseStatus).optional(),
  actualMoveInDate: z.string().datetime().optional().nullable(),
  actualMoveOutDate: z.string().datetime().optional().nullable(),
  agreementUrl: z.string().url().optional().nullable(),
  terminationReason: z.string().optional().nullable(),
  terminationDate: z.string().datetime().optional().nullable(),
});