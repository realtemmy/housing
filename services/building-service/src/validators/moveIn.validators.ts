import { z } from "zod";
import {
  MoveInHandoverStatus,
  InspectionStatus,
  ConditionReportType
} from "../generated/prisma/client";

// Create Zod enums from the Prisma enum types
export const MoveInHandoverStatusEnum = z.enum([
  MoveInHandoverStatus.SCHEDULED,
  MoveInHandoverStatus.IN_PROGRESS,
  MoveInHandoverStatus.PASSED,
  MoveInHandoverStatus.FAILED,
  MoveInHandoverStatus.COMPLETED
]);

export const InspectionStatusEnum = z.enum([
  InspectionStatus.PASS,
  InspectionStatus.FAIL,
  InspectionStatus.NA
]);

export const ConditionReportTypeEnum = z.enum([
  ConditionReportType.MOVE_IN,
  ConditionReportType.MOVE_OUT
]);

// MoveInHandover validators
export const createMoveInHandoverValidator = z.object({
  leaseId: z.string().min(1, "Lease ID is required"),
  scheduledFor: z.string().datetime().optional(),
});

export const updateMoveInHandoverValidator = z.object({
  status: MoveInHandoverStatusEnum.optional(),
  scheduledFor: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  inspectionPassed: z.boolean().optional(),
  keysHandedOver: z.boolean().optional(),
});

// InspectionChecklistItem validators
export const createInspectionChecklistItemValidator = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateInspectionChecklistItemValidator = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// InspectionChecklistResponse validators
export const createInspectionChecklistResponseValidator = z.object({
  moveInHandoverId: z.string().min(1, "Move-in/handover ID is required"),
  inspectionItemId: z.string().min(1, "Inspection item ID is required"),
  status: InspectionStatusEnum,
  notes: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export const updateInspectionChecklistResponseValidator = z.object({
  status: InspectionStatusEnum.optional(),
  notes: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

// ConditionReport validators
export const createConditionReportValidator = z.object({
  moveInHandoverId: z.string().min(1, "Move-in/handover ID is required"),
  reportType: ConditionReportTypeEnum,
  unitId: z.string().optional().nullable(),
  roomId: z.string().optional().nullable(),
  bedId: z.string().optional().nullable(),
  overallCondition: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
}).refine(
  (data) => data.unitId || data.roomId || data.bedId,
  { message: "At least one of unitId, roomId, or bedId must be provided" }
);

export const updateConditionReportValidator = z.object({
  reportType: ConditionReportTypeEnum.optional(),
  unitId: z.string().optional().nullable(),
  roomId: z.string().optional().nullable(),
  bedId: z.string().optional().nullable(),
  overallCondition: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
}).refine(
  (data) => data.unitId || data.roomId || data.bedId,
  { message: "At least one of unitId, roomId, or bedId must be provided" }
);

// KeyHandover validators
export const createKeyHandoverValidator = z.object({
  moveInHandoverId: z.string().min(1, "Move-in/handover ID is required"),
  keyType: z.string().min(1, "Key type is required"),
  quantity: z.number().int().positive().optional().default(1),
  condition: z.string().optional().nullable(),
  handedOver: z.boolean().optional().default(false),
  handedOverAt: z.string().datetime().optional().nullable(),
  handedOverBy: z.string().optional().nullable(),
});

export const updateKeyHandoverValidator = z.object({
  keyType: z.string().optional().nullable(),
  quantity: z.number().int().positive().optional(),
  condition: z.string().optional().nullable(),
  handedOver: z.boolean().optional(),
  handedOverAt: z.string().datetime().optional().nullable(),
  handedOverBy: z.string().optional().nullable(),
});