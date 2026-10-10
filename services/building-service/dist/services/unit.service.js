"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class UnitService {
    async getAllUnits(ownerId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // Build where clause - exclude soft deleted records unless includeDeleted is true
        const whereClause = {
            property: {
                ownerId,
                ...(options.includeDeleted ? {} : { deletedAt: null }),
            },
            ...(options.includeDeleted ? {} : { deletedAt: null }),
        };
        if (options.propertyId)
            whereClause.propertyId = options.propertyId;
        if (options.buildingId)
            whereClause.buildingId = options.buildingId;
        if (options.status)
            whereClause.status = options.status;
        const [totalItems, units] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.unit.count({ where: whereClause }),
            prisma_1.prisma.unit.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: {
                    photos: true,
                    building: { select: { id: true, name: true } },
                    property: { select: { id: true, title: true } },
                    maintenance: true,
                    rooms: {
                        include: {
                            beds: true,
                        },
                    },
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: units,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getUnitById(id, ownerId) {
        const unit = await prisma_1.prisma.unit.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                building: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
                photos: true,
                maintenance: true,
                rooms: {
                    include: {
                        beds: true,
                    },
                },
            },
        });
        if (!unit) {
            throw new appError_1.default("Unit not found", 404);
        }
        return unit;
    }
    async checkUnitAvailability(id, ownerId) {
        const now = new Date();
        const unit = await prisma_1.prisma.unit.findFirst({
            where: {
                id,
                ...(ownerId ? { property: { ownerId } } : {}),
                deletedAt: null,
            },
        });
        if (!unit) {
            return { available: false, message: "Unit not found" };
        }
        if (unit.status === "AVAILABLE") {
            return { available: true, message: "Unit is available" };
        }
        if (unit.status === "RESERVED" && unit.reservedUntil && unit.reservedUntil <= now) {
            // Reservation expired: reset to AVAILABLE on-demand
            await prisma_1.prisma.unit.update({
                where: { id },
                data: {
                    status: "AVAILABLE",
                    reservedAt: null,
                    reservedUntil: null,
                    depositAmount: null,
                },
            });
            return { available: true, message: "Unit is available" };
        }
        return { available: false, message: "Unit is not available" };
    }
    async createUnit(ownerId, input) {
        // Verify building exists and belongs to owner
        const building = await prisma_1.prisma.building.findFirst({
            where: {
                id: input.buildingId,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                property: true,
            },
        });
        if (!building) {
            throw new appError_1.default("Building not found or unauthorized", 404);
        }
        const propertyId = input.propertyId || building.propertyId;
        const unit = await prisma_1.prisma.unit.create({
            data: {
                unitNumber: input.unitNumber,
                summary: input.summary ?? null,
                type: input.type ?? "APARTMENT",
                floor: input.floor ?? null,
                bedrooms: input.bedrooms ?? null,
                bathrooms: input.bathrooms ?? null,
                sqft: input.sqft ?? null,
                status: input.status ?? "AVAILABLE",
                rentAmount: input.rentAmount ?? null,
                depositAmount: input.depositAmount ?? null,
                buildingId: input.buildingId,
                propertyId,
                // Financial information using Decimal
                rentAmount: input.rentAmount !== undefined ? new Prisma.Decimal(input.rentAmount.toString()) : undefined,
                depositAmount: input.depositAmount !== undefined ? new Prisma.Decimal(input.depositAmount.toString()) : undefined,
                initializedAt: null,
                reservedAt: null,
                reservedUntil: null,
                createdBy: ownerId,
                updatedBy: ownerId,
            },
            include: {
                building: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return unit;
    }
    async updateUnit(id, ownerId, input) {
        const existingUnit = await prisma_1.prisma.unit.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
        });
        if (!existingUnit) {
            throw new appError_1.default("Unit not found or unauthorized", 404);
        }
        if (input.buildingId && input.buildingId !== existingUnit.buildingId) {
            const building = await prisma_1.prisma.building.findFirst({
                where: {
                    id: input.buildingId,
                    property: { ownerId },
                    deletedAt: null,
                },
            });
            if (!building) {
                throw new appError_1.default("Target building not found or unauthorized", 404);
            }
        }
        const updatedUnit = await prisma_1.prisma.unit.update({
            where: { id },
            data: {
                ...(input.unitNumber !== undefined && { unitNumber: input.unitNumber }),
                ...(input.summary !== undefined && { summary: input.summary }),
                ...(input.type !== undefined && { type: input.type }),
                ...(input.floor !== undefined && { floor: input.floor }),
                ...(input.bedrooms !== undefined && { bedrooms: input.bedrooms }),
                ...(input.bathrooms !== undefined && { bathrooms: input.bathrooms }),
                ...(input.sqft !== undefined && { sqft: input.sqft }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.rentAmount !== undefined && { rentAmount: new Prisma.Decimal(input.rentAmount.toString()) }),
                ...(input.depositAmount !== undefined && { depositAmount: new Prisma.Decimal(input.depositAmount.toString()) }),
                ...(input.buildingId !== undefined && { buildingId: input.buildingId }),
                ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
                ...(input.verified !== undefined && { verified: input.verified }),
                updatedBy: ownerId,
            },
            include: {
                building: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return updatedUnit;
    }
    async softDeleteUnit(id, ownerId) {
        const unit = await prisma_1.prisma.unit.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                rooms: true,
            },
        });
        if (!unit) {
            throw new appError_1.default("Unit not found or unauthorized", 404);
        }
        if (unit.rooms.length > 0) {
            throw new appError_1.default("Cannot delete unit with existing rooms. Delete rooms first.", 400);
        }
        const deletedUnit = await prisma_1.prisma.unit.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: ownerId,
            },
        });
        return deletedUnit;
    }
    async restoreUnit(id, ownerId) {
        const unit = await prisma_1.prisma.unit.findFirst({
            where: {
                id,
                property: { ownerId },
            },
        });
        if (!unit) {
            throw new appError_1.default("Unit not found", 404);
        }
        if (!unit.deletedAt) {
            throw new appError_1.default("Unit is not deleted", 400);
        }
        const restoredUnit = await prisma_1.prisma.unit.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedBy: ownerId,
            },
            include: {
                building: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return restoredUnit;
    }
}
exports.UnitService = UnitService;
exports.default = new UnitService();
