import { z } from "zod";
import { PaymentStatus } from "../generated/prisma/client";

export const leasePaymentValidator = z.object({
  leaseId: z.string().min(1, "Lease ID is required"),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  reference: z.string().min(1, "Payment reference is required"),
  status: z.nativeEnum(PaymentStatus).optional(),
  currency: z.string().min(3, "Currency code must be at least 3 characters").optional().default("NGN"),
  paymentId: z.string().optional(),
});

export const updateLeasePaymentValidator = z.object({
  amount: z.number().min(0.01, "Amount must be greater than zero").optional(),
  reference: z.string().min(1, "Payment reference is required").optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  currency: z.string().min(3, "Currency code must be at least 3 characters").optional(),
  paymentId: z.string().optional(),
  paidAt: z.string().datetime().optional().nullable(),
});