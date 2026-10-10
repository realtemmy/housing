"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class RoomService {
    async getAllRooms(ownerId, options = {}) {
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
        if (options.unitId)
            whereClause.unitId = options.unitId;
        if (options.propertyId)
            whereClause.propertyId = options.propertyId;
        if (options.status)
            whereClause.status = options.status;
        const [totalItems, rooms] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.room.count({ where: whereClause }),
            prisma_1.prisma.room.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: {
                    beds: true,
                    unit: { select: { id: true, unitNumber: true } },
                    property: { select: { id: true, title: true } },
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: rooms,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getRoomById(id, ownerId) {
        const room = await prisma_1.prisma.room.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                beds: true,
                unit: { select: { id: true, unitNumber: true, buildingId: true } },
                property: { select: { id: true, title: true } },
            },
        });
        if (!room) {
            throw new appError_1.default("Room not found", 404);
        }
        return room;
    }
    async createRoom(ownerId, input) {
        const unit = await prisma_1.prisma.unit.findFirst({
            where: {
                id: input.unitId,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                property: true,
            },
        });
        if (!unit) {
            throw new appError_1.default("Unit not found or unauthorized", 404);
        }
        const room = await prisma_1.prisma.room.create({
            data: {
                name: input.name,
                description: input.description ?? null,
                summary: input.summary ?? null,
                size: input.size ?? null,
                type: input.type ?? null,
                rentAmount: input.rentAmount !== null && input.rentAmount !== undefined ? new client_1.Prisma.Decimal(input.rentAmount.toString()) : null,
                depositAmount: input.depositAmount !== null && input.depositAmount !== undefined ? new client_1.Prisma.Decimal(input.depositAmount.toString()) : null,
                status: input.status ?? "AVAILABLE",
                unitId: input.unitId,
                propertyId: unit.propertyId,
                initializedAt: null,
                createdBy: ownerId,
                updatedBy: ownerId,
            },
            include: {
                unit: { select: { id: true, unitNumber: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return room;
    }
    async updateRoom(id, ownerId, input) {
        const existingRoom = await prisma_1.prisma.room.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
        });
        if (!existingRoom) {
            throw new appError_1.default("Room not found or unauthorized", 404);
        }
        const updatedRoom = await prisma_1.prisma.room.update({
            where: { id },
            data: {
                ...(input.name !== undefined && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.summary !== undefined && { summary: input.summary }),
                ...(input.size !== undefined && { size: input.size }),
                ...(input.type !== undefined && { type: input.type }),
                ...(input.rentAmount !== null && input.rentAmount !== undefined && { rentAmount: new client_1.Prisma.Decimal(input.rentAmount.toString()) }),
                ...(input.depositAmount !== null && input.depositAmount !== undefined && { depositAmount: new client_1.Prisma.Decimal(input.depositAmount.toString()) }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
                ...(input.verified !== undefined && { verified: input.verified }),
                updatedBy: ownerId,
            },
            include: {
                beds: true,
                unit: { select: { id: true, unitNumber: true } },
            },
        });
        return updatedRoom;
    }
    async softDeleteRoom(id, ownerId) {
        const room = await prisma_1.prisma.room.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                beds: true,
            },
        });
        if (!room) {
            throw new appError_1.default("Room not found or unauthorized", 404);
        }
        if (room.beds.length > 0) {
            throw new appError_1.default("Cannot delete room with existing beds. Delete beds first.", 400);
        }
        const deletedRoom = await prisma_1.prisma.room.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: ownerId,
            },
        });
        return deletedRoom;
    }
    async restoreRoom(id, ownerId) {
        const room = await prisma_1.prisma.room.findFirst({
            where: {
                id,
                property: { ownerId },
            },
        });
        if (!room) {
            throw new appError_1.default("Room not found", 404);
        }
        if (!room.deletedAt) {
            throw new appError_1.default("Room is not deleted", 400);
        }
        const restoredRoom = await prisma_1.prisma.room.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedBy: ownerId,
            },
            include: {
                unit: { select: { id: true, unitNumber: true } },
                property: { select: { id: true, title: true } },
            },
        });
        return restoredRoom;
    }
}
exports.RoomService = RoomService;
exports.default = new RoomService();
