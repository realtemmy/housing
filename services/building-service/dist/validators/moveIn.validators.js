"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKeyHandoverValidator = exports.createKeyHandoverValidator = exports.updateConditionReportValidator = exports.createConditionReportValidator = exports.updateInspectionChecklistResponseValidator = exports.createInspectionChecklistResponseValidator = exports.updateInspectionChecklistItemValidator = exports.createInspectionChecklistItemValidator = exports.updateMoveInHandoverValidator = exports.createMoveInHandoverValidator = exports.ConditionReportTypeEnum = exports.InspectionStatusEnum = exports.MoveInHandoverStatusEnum = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
// Create Zod enums from the Prisma enum types
exports.MoveInHandoverStatusEnum = zod_1.z.enum([
    client_1.MoveInHandoverStatus.SCHEDULED,
    client_1.MoveInHandoverStatus.IN_PROGRESS,
    client_1.MoveInHandoverStatus.PASSED,
    client_1.MoveInHandoverStatus.FAILED,
    client_1.MoveInHandoverStatus.COMPLETED
]);
exports.InspectionStatusEnum = zod_1.z.enum([
    client_1.InspectionStatus.PASS,
    client_1.InspectionStatus.FAIL,
    client_1.InspectionStatus.NA
]);
exports.ConditionReportTypeEnum = zod_1.z.enum([
    client_1.ConditionReportType.MOVE_IN,
    client_1.ConditionReportType.MOVE_OUT
]);
// MoveInHandover validators
exports.createMoveInHandoverValidator = zod_1.z.object({
    leaseId: zod_1.z.string().min(1, "Lease ID is required"),
    scheduledFor: zod_1.z.string().datetime().optional(),
});
exports.updateMoveInHandoverValidator = zod_1.z.object({
    status: exports.MoveInHandoverStatusEnum.optional(),
    scheduledFor: zod_1.z.string().datetime().optional().nullable(),
    completedAt: zod_1.z.string().datetime().optional().nullable(),
    inspectionPassed: zod_1.z.boolean().optional(),
    keysHandedOver: zod_1.z.boolean().optional(),
});
// InspectionChecklistItem validators
exports.createInspectionChecklistItemValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional().nullable(),
    category: zod_1.z.string().optional().nullable(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateInspectionChecklistItemValidator = zod_1.z.object({
    name: zod_1.z.string().optional().nullable(),
    description: zod_1.z.string().optional().nullable(),
    category: zod_1.z.string().optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
// InspectionChecklistResponse validators
exports.createInspectionChecklistResponseValidator = zod_1.z.object({
    moveInHandoverId: zod_1.z.string().min(1, "Move-in/handover ID is required"),
    inspectionItemId: zod_1.z.string().min(1, "Inspection item ID is required"),
    status: exports.InspectionStatusEnum,
    notes: zod_1.z.string().optional().nullable(),
    photoUrl: zod_1.z.string().optional().nullable(),
});
exports.updateInspectionChecklistResponseValidator = zod_1.z.object({
    status: exports.InspectionStatusEnum.optional(),
    notes: zod_1.z.string().optional().nullable(),
    photoUrl: zod_1.z.string().optional().nullable(),
});
// ConditionReport validators
exports.createConditionReportValidator = zod_1.z.object({
    moveInHandoverId: zod_1.z.string().min(1, "Move-in/handover ID is required"),
    reportType: exports.ConditionReportTypeEnum,
    unitId: zod_1.z.string().optional().nullable(),
    roomId: zod_1.z.string().optional().nullable(),
    bedId: zod_1.z.string().optional().nullable(),
    overallCondition: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
}).refine((data) => data.unitId || data.roomId || data.bedId, { message: "At least one of unitId, roomId, or bedId must be provided" });
exports.updateConditionReportValidator = zod_1.z.object({
    reportType: exports.ConditionReportTypeEnum.optional(),
    unitId: zod_1.z.string().optional().nullable(),
    roomId: zod_1.z.string().optional().nullable(),
    bedId: zod_1.z.string().optional().nullable(),
    overallCondition: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
}).refine((data) => data.unitId || data.roomId || data.bedId, { message: "At least one of unitId, roomId, or bedId must be provided" });
// KeyHandover validators
exports.createKeyHandoverValidator = zod_1.z.object({
    moveInHandoverId: zod_1.z.string().min(1, "Move-in/handover ID is required"),
    keyType: zod_1.z.string().min(1, "Key type is required"),
    quantity: zod_1.z.number().int().positive().optional().default(1),
    condition: zod_1.z.string().optional().nullable(),
    handedOver: zod_1.z.boolean().optional().default(false),
    handedOverAt: zod_1.z.string().datetime().optional().nullable(),
    handedOverBy: zod_1.z.string().optional().nullable(),
});
exports.updateKeyHandoverValidator = zod_1.z.object({
    keyType: zod_1.z.string().optional().nullable(),
    quantity: zod_1.z.number().int().positive().optional(),
    condition: zod_1.z.string().optional().nullable(),
    handedOver: zod_1.z.boolean().optional(),
    handedOverAt: zod_1.z.string().datetime().optional().nullable(),
    handedOverBy: zod_1.z.string().optional().nullable(),
});
