import { z } from "zod";
import {
  ObligationType,
  PaymentMethod,
  PaymentVerificationStatus,
} from "../../generated/prisma/client";

export const createPaymentInstructionSchema = z.object({
  tenancyId: z.string().uuid(),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(10, "10-digit NUBAN account number required"),
  accountName: z.string().min(2, "Account name is required"),
  instructions: z.string().optional(),
  referenceTemplate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const reportPaymentSchema = z.object({
  tenancyId: z.string().uuid(),
  obligationId: z.string().uuid().optional(),
  amount: z.number().positive("Payment amount must be positive"),
  paymentDate: z.string().datetime(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.BANK_TRANSFER),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  providerReference: z.string().min(1, "Transaction reference or teller number is required"),
  evidenceUrl: z.string().url("Payment proof/receipt URL is required"),
  notes: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  status: z.enum([
    PaymentVerificationStatus.VERIFIED,
    PaymentVerificationStatus.REJECTED,
    PaymentVerificationStatus.DISPUTED,
  ]),
  rejectionReason: z.string().optional(),
});

export const correctPaymentSchema = z.object({
  correctedAmount: z.number().positive("Corrected amount must be positive"),
  reason: z.string().min(5, "Reason for correction is required"),
});

export const createRentObligationSchema = z.object({
  tenancyId: z.string().uuid(),
  obligationType: z.nativeEnum(ObligationType).default(ObligationType.RENT),
  dueDate: z.string().datetime(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  amountDue: z.number().positive(),
  description: z.string().optional(),
});
