"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class BedService {
    async getAllBeds(ownerId, options = {}) {
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
        if (options.roomId)
            whereClause.roomId = options.roomId;
        if (options.propertyId)
            whereClause.propertyId = options.propertyId;
        if (options.status)
            whereClause.status = options.status;
        const [totalItems, beds] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.bed.count({ where: whereClause }),
            prisma_1.prisma.bed.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: {
                    room: { select: { id: true, name: true, unitId: true } },
                    property: { select: { id: true, title: true } },
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: beds,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getBedById(id, ownerId) {
        const bed = await prisma_1.prisma.bed.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                room: { select: { id: true, name: true, unitId: true } },
                property: { select: { id: true, title: true } },
            },
        });
        if (!bed) {
            throw new appError_1.default("Bed not found", 404);
        }
        return bed;
    }
    async createBed(ownerId, input) {
        const room = await prisma_1.prisma.room.findFirst({
            where: {
                id: input.roomId,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                property: true,
            },
        });
        if (!room) {
            throw new appError_1.default("Room not found or unauthorized", 404);
        }
        const bed = await prisma_1.prisma.bed.create({
            data: {
                label: input.label,
                rentAmount: new client_1.Prisma.Decimal(input.rentAmount.toString()),
                depositAmount: input.depositAmount !== null && input.depositAmount !== undefined
                    ? new client_1.Prisma.Decimal(input.depositAmount.toString())
                    : null,
                status: input.status ?? "AVAILABLE",
                roomId: input.roomId,
                propertyId: room.propertyId,
                occupantId: input.occupantId ?? null,
                initializedAt: null,
                createdBy: ownerId,
                updatedBy: ownerId,
            },
            include: {
                room: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return bed;
    }
    async updateBed(id, ownerId, input) {
        const existingBed = await prisma_1.prisma.bed.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
        });
        if (!existingBed) {
            throw new appError_1.default("Bed not found or unauthorized", 404);
        }
        const updatedBed = await prisma_1.prisma.bed.update({
            where: { id },
            data: {
                ...(input.label !== undefined && { label: input.label }),
                ...(input.rentAmount !== undefined && { rentAmount: new client_1.Prisma.Decimal(input.rentAmount.toString()) }),
                ...(input.depositAmount !== null && input.depositAmount !== undefined && { depositAmount: new client_1.Prisma.Decimal(input.depositAmount.toString()) }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
                updatedBy: ownerId,
            },
            include: {
                room: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return updatedBed;
    }
    async softDeleteBed(id, ownerId) {
        const bed = await prisma_1.prisma.bed.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
        });
        if (!bed) {
            throw new appError_1.default("Bed not found or unauthorized", 404);
        }
        const deletedBed = await prisma_1.prisma.bed.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: ownerId,
            },
        });
        return deletedBed;
    }
    async restoreBed(id, ownerId) {
        const bed = await prisma_1.prisma.bed.findFirst({
            where: {
                id,
                property: { ownerId },
            },
        });
        if (!bed) {
            throw new appError_1.default("Bed not found", 404);
        }
        if (!bed.deletedAt) {
            throw new appError_1.default("Bed is not deleted", 400);
        }
        const restoredBed = await prisma_1.prisma.bed.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedBy: ownerId,
            },
            include: {
                room: { select: { id: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return restoredBed;
    }
}
exports.BedService = BedService;
exports.default = new BedService();
