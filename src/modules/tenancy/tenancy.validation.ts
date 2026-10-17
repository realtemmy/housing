import { z } from "zod";
import { TenancyStatus, BillingFrequency, AgreementStatus } from "../../generated/prisma/client";

export const createTenancySchema = z.object({
  propertyId: z.string().uuid(),
  unitId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  bedId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
  applicationId: z.string().uuid().optional(),
  reservationId: z.string().uuid().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  propertyReadyDate: z.string().datetime().optional(),
  commencementDate: z.string().datetime().optional(),
  rentAmount: z.number().positive(),
  cautionDeposit: z.number().min(0),
  serviceCharge: z.number().min(0).default(0),
  billingFrequency: z.nativeEnum(BillingFrequency).default(BillingFrequency.ANNUAL),
  rentDueDay: z.number().int().min(1).max(31).optional(),
  gracePeriodDays: z.number().int().min(0).default(5),
  lateFeeAmount: z.number().min(0).default(0),
});

export const updateTenancySchema = z.object({
  status: z.nativeEnum(TenancyStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  propertyReadyDate: z.string().datetime().optional(),
  actualHandoverDate: z.string().datetime().optional(),
  commencementDate: z.string().datetime().optional(),
  actualMoveOutDate: z.string().datetime().optional(),
  rentDueDay: z.number().int().min(1).max(31).optional(),
  terminationReason: z.string().optional(),
});

export const addOccupantSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const createAgreementSchema = z.object({
  termsContent: z.string().min(10, "Terms content is required"),
  documentUrl: z.string().url().optional(),
});

export const signAgreementSchema = z.object({
  signatureConfirmation: z.literal(true, {
    message: "You must confirm acceptance of the digital agreement",
  }),
});
