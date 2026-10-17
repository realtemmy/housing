import { z } from "zod";
import { ApplicationStatus, OfferStatus, BillingFrequency } from "../../generated/prisma/client";

export const createApplicationSchema = z.object({
  listingId: z.string().uuid(),
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  employmentStatus: z.string().min(2, "Employment status is required"),
  employerName: z.string().min(2, "Employer name is required"),
  idDocumentUrl: z.string().url().optional(),
  guarantorName: z.string().optional(),
  guarantorPhone: z.string().optional(),
  proposedMoveInDate: z.string().datetime(),
  coverLetter: z.string().optional(),
});

export const reviewApplicationSchema = z.object({
  status: z.enum([
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.APPROVED,
    ApplicationStatus.DECLINED,
  ]),
  decisionNotes: z.string().optional(),
});

export const createOfferSchema = z.object({
  applicationId: z.string().uuid(),
  agreedRent: z.number().positive(),
  agreedCautionDeposit: z.number().min(0),
  agreedServiceCharge: z.number().min(0).default(0),
  billingFrequency: z.nativeEnum(BillingFrequency).default(BillingFrequency.ANNUAL),
  leaseDurationMonths: z.number().int().min(1).default(12),
  notes: z.string().optional(),
});

export const respondOfferSchema = z.object({
  status: z.enum([OfferStatus.ACCEPTED, OfferStatus.REJECTED]),
  notes: z.string().optional(),
});

export const createReservationHoldSchema = z.object({
  applicationId: z.string().uuid(),
  holdHours: z.number().int().min(1).max(72).default(24),
  holdFeeAmount: z.number().min(0).optional(),
});
