import { z } from "zod";
import { VerificationCaseCategory, VerificationCaseStatus } from "../../generated/prisma/client";

export const submitVerificationSchema = z.object({
  propertyId: z.string().uuid(),
  category: z.nativeEnum(VerificationCaseCategory).default(VerificationCaseCategory.COMBINED),
  evidenceUrls: z.array(z.string().url()).min(1, "At least one evidence document or photo is required"),
  meterNumber: z.string().optional(),
  gpsLatitude: z.number().min(-90).max(90).optional(),
  gpsLongitude: z.number().min(-180).max(180).optional(),
  ownershipDocUrl: z.string().url().optional(),
});

export const reviewVerificationSchema = z.object({
  status: z.enum([
    VerificationCaseStatus.APPROVED,
    VerificationCaseStatus.REJECTED,
    VerificationCaseStatus.MORE_INFO_REQUIRED,
  ]),
  decisionNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export const reportSuspiciousListingSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.string().min(3, "Reason is required"),
  details: z.string().optional(),
});

export const reviewSuspiciousReportSchema = z.object({
  status: z.enum(["REVIEWED", "DISMISSED", "ACTION_TAKEN"]),
  adminNotes: z.string().optional(),
  delistListing: z.boolean().default(false),
});
