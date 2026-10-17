import { z } from "zod";
import {
  MaintenanceCategory,
  MaintenanceUrgency,
  MaintenanceStatus,
} from "../../generated/prisma/client";

export const createMaintenanceSchema = z.object({
  propertyId: z.string().uuid(),
  tenancyId: z.string().uuid().optional(),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Detailed description is required"),
  category: z.nativeEnum(MaintenanceCategory).default(MaintenanceCategory.OTHER),
  urgency: z.nativeEnum(MaintenanceUrgency).default(MaintenanceUrgency.MEDIUM),
  accessPreference: z.string().optional(),
  attachmentUrls: z.array(z.string().url()).default([]),
});

export const updateMaintenanceStatusSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus),
  assignedToId: z.string().uuid().optional(),
  estimatedCost: z.number().min(0).optional(),
  actualCost: z.number().min(0).optional(),
  scheduledFor: z.string().datetime().optional(),
  rejectionReason: z.string().optional(),
  note: z.string().optional(),
});

export const addMaintenanceCommentSchema = z.object({
  message: z.string().min(1, "Comment message cannot be empty"),
  isInternal: z.boolean().default(false),
});
