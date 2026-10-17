import { z } from "zod";
import { IssueCategory, IssuePriority, IssueStatus } from "../../generated/prisma/client";

export const createTenantIssueSchema = z.object({
  propertyId: z.string().uuid(),
  tenancyId: z.string().uuid().optional(),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Detailed description is required"),
  category: z.nativeEnum(IssueCategory).default(IssueCategory.OTHER),
  priority: z.nativeEnum(IssuePriority).default(IssuePriority.MEDIUM),
  evidenceUrls: z.array(z.string().url()).default([]),
});

export const updateTenantIssueSchema = z.object({
  status: z.nativeEnum(IssueStatus),
  assignedToId: z.string().uuid().optional(),
  resolutionNotes: z.string().optional(),
  note: z.string().optional(),
});

export const addIssueCommentSchema = z.object({
  comment: z.string().min(1, "Comment message cannot be empty"),
  isPrivate: z.boolean().default(false),
});
