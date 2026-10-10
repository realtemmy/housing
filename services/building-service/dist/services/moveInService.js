"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveInService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class MoveInService {
    // MoveInHandover methods
    async createMoveInHandover(input) {
        // Note: In a microservices architecture, we cannot directly validate
        // the lease exists as it's in another service. Validation should be
        // handled at the API gateway or through service-to-service communication.
        // For now, we'll proceed with creating the move-in/handover record.
        const moveInHandover = await prisma_1.prisma.moveInHandover.create({
            data: {
                leaseId: input.leaseId,
                scheduledFor: input.scheduledFor
                    ? typeof input.scheduledFor === "string"
                        ? new Date(input.scheduledFor)
                        : input.scheduledFor
                    : undefined,
            },
        });
        return moveInHandover;
    }
    async getMoveInHandoverById(id) {
        const moveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id },
            include: {
                inspectionItems: {
                    include: {
                        inspectionItem: true,
                    },
                },
                conditionReports: true,
                keyHandovers: true,
            },
        });
        if (!moveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        return moveInHandover;
    }
    async getMoveInHandoversByLeaseId(leaseId) {
        const moveInHandovers = await prisma_1.prisma.moveInHandover.findMany({
            where: { leaseId },
            include: {
                inspectionItems: {
                    include: {
                        inspectionItem: true,
                    },
                },
                conditionReports: true,
                keyHandovers: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return moveInHandovers;
    }
    async updateMoveInHandover(id, input) {
        const existingMoveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id },
        });
        if (!existingMoveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        // If status is being updated to COMPLETED, check if we should auto-update lease
        const updateData = {
            ...(input.status !== undefined && { status: input.status }),
            ...(input.scheduledFor !== undefined && {
                scheduledFor: input.scheduledFor === null
                    ? null
                    : typeof input.scheduledFor === "string"
                        ? new Date(input.scheduledFor)
                        : input.scheduledFor
            }),
            ...(input.completedAt !== undefined && {
                completedAt: input.completedAt === null
                    ? null
                    : typeof input.completedAt === "string"
                        ? new Date(input.completedAt)
                        : input.completedAt
            }),
            ...(input.inspectionPassed !== undefined && { inspectionPassed: input.inspectionPassed }),
            ...(input.keysHandedOver !== undefined && { keysHandedOver: input.keysHandedOver }),
            updatedAt: new Date(),
        };
        const moveInHandover = await prisma_1.prisma.moveInHandover.update({
            where: { id },
            data: updateData,
            include: {
                inspectionItems: {
                    include: {
                        inspectionItem: true,
                    },
                },
                conditionReports: true,
                keyHandovers: true,
            },
        });
        // If move-in is completed successfully, we would need to update the lease status
        // In a microservices architecture, this would typically be done through
        // service-to-service communication or an event-driven approach
        // For now, we'll skip the direct lease update and note that this would need
        // to be handled by the lease service or through an event system
        if (input.status === client_1.MoveInHandoverStatus.COMPLETED ||
            (input.inspectionPassed === true && input.keysHandedOver === true)) {
            // In a real implementation, we would emit an event or call the lease service
            // to update the lease status to ACTIVE and set the actualMoveInDate
            // For now, we'll just complete the move-in/handover record
            await prisma_1.prisma.moveInHandover.update({
                where: { id },
                data: {
                    status: client_1.MoveInHandoverStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });
        }
        return moveInHandover;
    }
    async deleteMoveInHandover(id) {
        const moveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id },
        });
        if (!moveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        await prisma_1.prisma.moveInHandover.delete({
            where: { id },
        });
        return { id };
    }
    // InspectionChecklistItem methods
    async createInspectionChecklistItem(input) {
        const checklistItem = await prisma_1.prisma.inspectionChecklistItem.create({
            data: {
                name: input.name,
                description: input.description ?? null,
                category: input.category ?? null,
                isActive: input.isActive ?? true,
            },
        });
        return checklistItem;
    }
    async getInspectionChecklistItems(options = {}) {
        const whereClause = {};
        if (options.isActive !== undefined) {
            whereClause.isActive = options.isActive;
        }
        const checklistItems = await prisma_1.prisma.inspectionChecklistItem.findMany({
            where: whereClause,
            orderBy: { name: "asc" },
        });
        return checklistItems;
    }
    async updateInspectionChecklistItem(id, input) {
        const existingItem = await prisma_1.prisma.inspectionChecklistItem.findUnique({
            where: { id },
        });
        if (!existingItem) {
            throw new appError_1.default("Inspection checklist item not found", 404);
        }
        const checklistItem = await prisma_1.prisma.inspectionChecklistItem.update({
            where: { id },
            data: {
                ...(input.name !== undefined && { name: input.name }),
                ...(input.description !== undefined && {
                    description: input.description === null ? null : input.description
                }),
                ...(input.category !== undefined && {
                    category: input.category === null ? null : input.category
                }),
                ...(input.isActive !== undefined && { isActive: input.isActive }),
                updatedAt: new Date(),
            },
        });
        return checklistItem;
    }
    async deleteInspectionChecklistItem(id) {
        const item = await prisma_1.prisma.inspectionChecklistItem.findUnique({
            where: { id },
        });
        if (!item) {
            throw new appError_1.default("Inspection checklist item not found", 404);
        }
        await prisma_1.prisma.inspectionChecklistItem.delete({
            where: { id },
        });
        return { id };
    }
    // InspectionChecklistResponse methods
    async createInspectionChecklistResponse(input) {
        // Verify move-in/handover exists
        const moveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id: input.moveInHandoverId },
        });
        if (!moveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        // Verify inspection item exists
        const inspectionItem = await prisma_1.prisma.inspectionChecklistItem.findUnique({
            where: { id: input.inspectionItemId },
        });
        if (!inspectionItem) {
            throw new appError_1.default("Inspection checklist item not found", 404);
        }
        const response = await prisma_1.prisma.inspectionChecklistResponse.create({
            data: {
                moveInHandoverId: input.moveInHandoverId,
                inspectionItemId: input.inspectionItemId,
                status: input.status,
                notes: input.notes ?? null,
                photoUrl: input.photoUrl ?? null,
            },
        });
        return response;
    }
    async getInspectionChecklistResponsesByMoveInHandoverId(moveInHandoverId) {
        const responses = await prisma_1.prisma.inspectionChecklistResponse.findMany({
            where: { moveInHandoverId },
            include: {
                inspectionItem: true,
            },
            orderBy: { inspectedAt: "asc" },
        });
        return responses;
    }
    async updateInspectionChecklistResponse(id, input) {
        const existingResponse = await prisma_1.prisma.inspectionChecklistResponse.findUnique({
            where: { id },
        });
        if (!existingResponse) {
            throw new appError_1.default("Inspection checklist response not found", 404);
        }
        const response = await prisma_1.prisma.inspectionChecklistResponse.update({
            where: { id },
            data: {
                ...(input.status !== undefined && { status: input.status }),
                ...(input.notes !== undefined && {
                    notes: input.notes === null ? null : input.notes
                }),
                ...(input.photoUrl !== undefined && {
                    photoUrl: input.photoUrl === null ? null : input.photoUrl
                }),
            },
        });
        return response;
    }
    async deleteInspectionChecklistResponse(id) {
        const response = await prisma_1.prisma.inspectionChecklistResponse.findUnique({
            where: { id },
        });
        if (!response) {
            throw new appError_1.default("Inspection checklist response not found", 404);
        }
        await prisma_1.prisma.inspectionChecklistResponse.delete({
            where: { id },
        });
        return { id };
    }
    // ConditionReport methods
    async createConditionReport(input) {
        // Verify move-in/handover exists
        const moveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id: input.moveInHandoverId },
        });
        if (!moveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        // Verify at least one location identifier is provided
        if (!input.unitId && !input.roomId && !input.bedId) {
            throw new appError_1.default("At least one of unitId, roomId, or bedId must be provided", 400);
        }
        // Verify the specified location exists
        if (input.unitId) {
            const unit = await prisma_1.prisma.unit.findUnique({
                where: { id: input.unitId },
            });
            if (!unit) {
                throw new appError_1.default("Unit not found", 404);
            }
        }
        if (input.roomId) {
            const room = await prisma_1.prisma.room.findUnique({
                where: { id: input.roomId },
            });
            if (!room) {
                throw new appError_1.default("Room not found", 404);
            }
        }
        if (input.bedId) {
            const bed = await prisma_1.prisma.bed.findUnique({
                where: { id: input.bedId },
            });
            if (!bed) {
                throw new appError_1.default("Bed not found", 404);
            }
        }
        const conditionReport = await prisma_1.prisma.conditionReport.create({
            data: {
                moveInHandoverId: input.moveInHandoverId,
                reportType: input.reportType,
                unitId: input.unitId ?? null,
                roomId: input.roomId ?? null,
                bedId: input.bedId ?? null,
                overallCondition: input.overallCondition ?? null,
                notes: input.notes ?? null,
            },
        });
        return conditionReport;
    }
    async getConditionReportsByMoveInHandoverId(moveInHandoverId) {
        const conditionReports = await prisma_1.prisma.conditionReport.findMany({
            where: { moveInHandoverId },
            orderBy: { createdAt: "desc" },
        });
        return conditionReports;
    }
    async updateConditionReport(id, input) {
        const existingReport = await prisma_1.prisma.conditionReport.findUnique({
            where: { id },
        });
        if (!existingReport) {
            throw new appError_1.default("Condition report not found", 404);
        }
        // Verify at least one location identifier is provided (if updating)
        const unitId = input.unitId !== undefined ? input.unitId : existingReport.unitId;
        const roomId = input.roomId !== undefined ? input.roomId : existingReport.roomId;
        const bedId = input.bedId !== undefined ? input.bedId : existingReport.bedId;
        if (!unitId && !roomId && !bedId) {
            throw new appError_1.default("At least one of unitId, roomId, or bedId must be provided", 400);
        }
        // Verify the specified location exists
        if (unitId) {
            const unit = await prisma_1.prisma.unit.findUnique({ where: { id: unitId } });
            if (!unit) {
                throw new appError_1.default("Unit not found", 404);
            }
        }
        if (roomId) {
            const room = await prisma_1.prisma.room.findUnique({ where: { id: roomId } });
            if (!room) {
                throw new appError_1.default("Room not found", 404);
            }
        }
        if (bedId) {
            const bed = await prisma_1.prisma.bed.findUnique({ where: { id: bedId } });
            if (!bed) {
                throw new appError_1.default("Bed not found", 404);
            }
        }
        const conditionReport = await prisma_1.prisma.conditionReport.update({
            where: { id },
            data: {
                ...(input.reportType !== undefined && { reportType: input.reportType }),
                ...(input.unitId !== undefined && {
                    unitId: input.unitId === null ? null : input.unitId
                }),
                ...(input.roomId !== undefined && {
                    roomId: input.roomId === null ? null : input.roomId
                }),
                ...(input.bedId !== undefined && {
                    bedId: input.bedId === null ? null : input.bedId
                }),
                ...(input.overallCondition !== undefined && {
                    overallCondition: input.overallCondition === null ? null : input.overallCondition
                }),
                ...(input.notes !== undefined && {
                    notes: input.notes === null ? null : input.notes
                }),
            },
        });
        return conditionReport;
    }
    async deleteConditionReport(id) {
        const report = await prisma_1.prisma.conditionReport.findUnique({
            where: { id },
        });
        if (!report) {
            throw new appError_1.default("Condition report not found", 404);
        }
        await prisma_1.prisma.conditionReport.delete({
            where: { id },
        });
        return { id };
    }
    // KeyHandover methods
    async createKeyHandover(input) {
        // Verify move-in/handover exists
        const moveInHandover = await prisma_1.prisma.moveInHandover.findUnique({
            where: { id: input.moveInHandoverId },
        });
        if (!moveInHandover) {
            throw new appError_1.default("Move-in/handover record not found", 404);
        }
        const keyHandover = await prisma_1.prisma.keyHandover.create({
            data: {
                moveInHandoverId: input.moveInHandoverId,
                keyType: input.keyType,
                quantity: input.quantity ?? 1,
                condition: input.condition ?? null,
                handedOver: input.handedOver ?? false,
                handedOverAt: input.handedOverAt
                    ? typeof input.handedOverAt === "string"
                        ? new Date(input.handedOverAt)
                        : input.handedOverAt
                    : null,
                handedOverBy: input.handedOverBy ?? null,
            },
        });
        return keyHandover;
    }
    async getKeyHandoversByMoveInHandoverId(moveInHandoverId) {
        const keyHandovers = await prisma_1.prisma.keyHandover.findMany({
            where: { moveInHandoverId },
            orderBy: { createdAt: "asc" },
        });
        return keyHandovers;
    }
    async updateKeyHandover(id, input) {
        const existingHandover = await prisma_1.prisma.keyHandover.findUnique({
            where: { id },
        });
        if (!existingHandover) {
            throw new appError_1.default("Key handover record not found", 404);
        }
        const keyHandover = await prisma_1.prisma.keyHandover.update({
            where: { id },
            data: {
                ...(input.keyType !== undefined && {
                    keyType: input.keyType === null ? null : input.keyType
                }),
                ...(input.quantity !== undefined && { quantity: input.quantity }),
                ...(input.condition !== undefined && {
                    condition: input.condition === null ? null : input.condition
                }),
                ...(input.handedOver !== undefined && { handedOver: input.handedOver }),
                ...(input.handedOverAt !== undefined && {
                    handedOverAt: input.handedOverAt === null
                        ? null
                        : typeof input.handedOverAt === "string"
                            ? new Date(input.handedOverAt)
                            : input.handedOverAt
                }),
                ...(input.handedOverBy !== undefined && {
                    handedOverBy: input.handedOverBy === null ? null : input.handedOverBy
                }),
            },
        });
        return keyHandover;
    }
    async deleteKeyHandover(id) {
        const handover = await prisma_1.prisma.keyHandover.findUnique({
            where: { id },
        });
        if (!handover) {
            throw new appError_1.default("Key handover record not found", 404);
        }
        await prisma_1.prisma.keyHandover.delete({
            where: { id },
        });
        return { id };
    }
}
exports.MoveInService = MoveInService;
exports.default = new MoveInService();
