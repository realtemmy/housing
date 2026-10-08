import { z } from "zod";

export const generateLeaseAgreementValidator = z.object({
  leaseId: z.string().uuid("Lease ID must be a valid UUID"),
  customFields: z.record(z.any()).optional(),
});

export const signLeaseAgreementValidator = z.object({
  signerType: z.enum(['TENANT', 'LANDLORD']),
  signatureData: z.string().optional(),
});

export const executeLeaseAgreementValidator = z.object({
  leaseId: z.string().uuid("Lease ID must be a valid UUID"),
});

export const terminateLeaseAgreementValidator = z.object({
  leaseId: z.string().uuid("Lease ID must be a valid UUID"),
  reason: z.string().min(1, "Termination reason is required"),
});