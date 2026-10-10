import { z } from "zod";
import { PaymentFrequency, LeaseStatus } from "../generated/prisma/client";

/**
 * Validation schema for creating a lease with rent tracking fields
 */
export const createLeaseSchema = z.object({
  rentableId: z.string(),
  rentableType: z.nativeEnum(PaymentFrequency), // Reusing PaymentFrequency enum for rentableType
  tenantId: z.string(),
  rentAmount: z.number().positive(),
  securityDeposit: z.number().nonnegative().optional(),
  serviceCharge: z.number().nonnegative().optional(),
  paymentFrequency: z.nativeEnum(PaymentFrequency).optional(),
  actualMoveInDate: z.string().datetime().optional(),
  agreementUrl: z.string().url().optional().nullable(),

  // RENT TRACKING FIELDS
  rentDueDay: z.number().int().min(1).max(31).optional(),
  gracePeriodDays: z.number().int().nonnegative().optional(),
  lateFeeAmount: z.number().nonnegative().optional(),
  lateFeePercentage: z.number().nonnegative().max(1).optional(), // Max 100% (1.0)
});

/**
 * Validation schema for updating a lease with rent tracking fields
 */
export const updateLeaseSchema = z.object({
  rentAmount: z.number().positive().optional(),
  securityDeposit: z.number().nonnegative().optional(),
  serviceCharge: z.number().nonnegative().optional(),
  paymentFrequency: z.nativeEnum(PaymentFrequency).optional(),
  status: z.nativeEnum(LeaseStatus).optional(),
  actualMoveInDate: z.string().datetime().optional().nullable(),
  actualMoveOutDate: z.string().datetime().optional().nullable(),
  agreementUrl: z.string().url().optional().nullable(),
  terminationReason: z.string().optional(),
  terminationDate: z.string().datetime().optional().nullable(),

  // RENT TRACKING FIELDS
  rentDueDay: z.number().int().min(1).max(31).optional(),
  gracePeriodDays: z.number().int().nonnegative().optional(),
  lateFeeAmount: z.number().nonnegative().optional(),
  lateFeePercentage: z.number().nonnegative().max(1).optional(), // Max 100% (1.0)
});

/**
 * Validation schema for rent payment processing options
 */
export const rentPaymentOptionsSchema = z.object({
  applyLateFees: z.boolean().default(true),
  sendNotifications: z.boolean().default(true),
  updateLeaseStatus: z.boolean().default(true),
});

/**
 * Validation schema for generating payment schedule
 */
export const generatePaymentScheduleSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  paymentFrequency: z.nativeEnum(PaymentFrequency),
  rentDueDay: z.number().int().min(1).max(31).optional(),
});

/**
 * Validation schema for calculating next due date
 */
export const calculateNextDueDateSchema = z.object({
  startDate: z.string().datetime(),
  paymentFrequency: z.nativeEnum(PaymentFrequency),
  rentDueDay: z.number().int().min(1).max(31).optional(),
});

export type CreateLeaseInput = z.infer<typeof createLeaseSchema>;
export type UpdateLeaseInput = z.infer<typeof updateLeaseSchema>;
export type RentPaymentOptions = z.infer<typeof rentPaymentOptionsSchema>;
export type GeneratePaymentScheduleInput = z.infer<typeof generatePaymentScheduleSchema>;
export type CalculateNextDueDateInput = z.infer<typeof calculateNextDueDateSchema>;