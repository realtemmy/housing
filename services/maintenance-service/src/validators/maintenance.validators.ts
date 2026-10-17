import { z } from "zod";

export const createMaintenanceRequestSchema = z.object({
  tenantId: z.string(),
  propertyId: z.string(),
  unitId: z.string().optional(),
  description: z.string().min(10),
  type: z.enum(["REPAIR", "PREVENTIVE", "INSPECTION", "EMERGENCY", "RENOVATION"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export const updateMaintenanceRequestSchema = z.object({
  description: z.string().min(10).optional(),
  type: z.enum(["REPAIR", "PREVENTIVE", "INSPECTION", "EMERGENCY", "RENOVATION"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["REQUESTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  scheduledFor: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export const maintenanceHistorySchema = z.object({
  action: z.string().min(1),
  performedBy: z.string(),
  notes: z.string().optional(),
});
