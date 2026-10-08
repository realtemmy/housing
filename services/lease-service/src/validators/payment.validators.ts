import { z } from "zod";
import { PaymentGateway, PaymentTransactionStatus } from "../generated/prisma/client";

export const paymentValidator = z.object({
  paymentType: z.enum(['APPLICATION_FEE', 'RESERVATION_FEE', 'DEPOSIT', 'LEASE_PAYMENT']),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  currency: z.string().length(3, "Currency code must be 3 characters").optional().default("NGN"),
  customerEmail: z.string().email("Invalid email format"),
  customerName: z.string().min(1, "Customer name is required"),
  // Reference to what this payment is for
  applicationId: z.string().optional(),
  reservationId: z.string().optional(),
  leasePaymentId: z.string().optional(),
  // Optional: payment method details
  paymentMethodId: z.string().optional(),
});

export const refundPaymentValidator = z.object({
  amount: z.number().min(0.01, "Refund amount must be greater than zero").optional(),
});