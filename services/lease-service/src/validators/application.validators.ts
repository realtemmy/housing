import { z } from "zod";
import { ApplicationStatus } from "../generated/prisma/client";

export const applicationValidator = z.object({
  applicantId: z.string().min(1, "Applicant ID is required"),
  applicationType: z.enum(['property', 'unit', 'room', 'bed']),
  applicationId: z.string().min(1, "Application target ID is required"),
  coverLetter: z.string().optional(),
  desiredMoveInDate: z.string().datetime().optional(),
  applicationFee: z.number().min(0, "Application fee must be zero or positive").optional(),
  answers: z.any().optional(),
});

export const updateApplicationValidator = z.object({
  coverLetter: z.string().optional().nullable(),
  desiredMoveInDate: z.string().datetime().optional().nullable(),
  applicationFee: z.number().min(0, "Application fee must be zero or positive").optional(),
  answers: z.any().optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  reviewedAt: z.string().datetime().optional().nullable(),
  reviewedBy: z.string().optional(),
  applicationFeePaid: z.boolean().optional(),
  adminNotes: z.string().optional().nullable(),
});