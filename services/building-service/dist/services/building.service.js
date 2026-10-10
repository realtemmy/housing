"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class BuildingService {
    async getAllBuildings(ownerId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const search = options.search || "";
        const orderBy = options.orderBy === "asc" ? "asc" : "desc";
        const skip = (page - 1) * limit;
        // Build where clause - exclude soft deleted records unless includeDeleted is true
        const whereClause = {
            property: {
                ownerId,
                ...(options.includeDeleted ? {} : { deletedAt: null }),
            },
            ...(options.propertyId ? { propertyId: options.propertyId } : {}),
            ...(options.includeDeleted ? {} : { deletedAt: null }),
            name: {
                contains: search,
                mode: "insensitive",
            },
        };
        const [totalItems, buildings] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.building.count({ where: whereClause }),
            prisma_1.prisma.building.findMany({
                skip,
                take: limit,
                where: whereClause,
                orderBy: { createdAt: orderBy },
                include: {
                    _count: { select: { units: true } },
                    property: { select: { id: true, title: true, ownerId: true } },
                    address: { select: { id: true, city: true, state: true, street: true, country: true, postalCode: true } },
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: buildings,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getBuildingById(id, ownerId) {
        const building = await prisma_1.prisma.building.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                _count: { select: { units: true } },
                address: true,
                units: true,
                property: { select: { id: true, title: true, ownerId: true } },
            },
        });
        if (!building) {
            throw new appError_1.default("Building not found", 404);
        }
        return building;
    }
    async createBuilding(ownerId, input) {
        // Verify property ownership
        const property = await prisma_1.prisma.property.findFirst({
            where: { id: input.propertyId, ownerId, deletedAt: null },
        });
        if (!property) {
            throw new appError_1.default("Property not found or unauthorized", 404);
        }
        // Create address
        const address = await prisma_1.prisma.address.create({
            data: {
                street: input.address.street,
                city: input.address.city,
                state: input.address.state,
                postalCode: input.address.postalCode,
                country: input.address.country,
                latitude: input.address.latitude ?? null,
                longitude: input.address.longitude ?? null,
            },
        });
        const building = await prisma_1.prisma.building.create({
            data: {
                propertyId: input.propertyId,
                name: input.name,
                floors: input.floors ?? 0,
                description: input.description ?? null,
                summary: input.summary ?? null,
                verified: false,
                address: { connect: { id: address.id } },
                createdBy: ownerId,
                updatedBy: ownerId,
            },
            include: {
                property: true,
                address: true,
            },
        });
        return building;
    }
    async updateBuilding(id, ownerId, input) {
        const building = await prisma_1.prisma.building.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
        });
        if (!building) {
            throw new appError_1.default("Building not found or unauthorized", 404);
        }
        const updatedBuilding = await prisma_1.prisma.building.update({
            where: { id },
            data: {
                ...(input.name !== undefined && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.summary !== undefined && { summary: input.summary }),
                ...(input.floors !== undefined && { floors: input.floors }),
                ...(input.verified !== undefined && { verified: input.verified }),
                updatedBy: ownerId,
            },
            include: {
                property: true,
                address: true,
                units: true,
            },
        });
        return updatedBuilding;
    }
    async softDeleteBuilding(id, ownerId) {
        const building = await prisma_1.prisma.building.findFirst({
            where: {
                id,
                property: { ownerId },
                deletedAt: null,
            },
            include: {
                units: true,
            },
        });
        if (!building) {
            throw new appError_1.default("Building not found or unauthorized", 404);
        }
        if (building.units.length > 0) {
            throw new appError_1.default("Cannot delete building with existing units. Delete units first.", 400);
        }
        const deletedBuilding = await prisma_1.prisma.building.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: ownerId,
            },
        });
        return deletedBuilding;
    }
    async restoreBuilding(id, ownerId) {
        const building = await prisma_1.prisma.building.findFirst({
            where: {
                id,
                property: { ownerId },
            },
        });
        if (!building) {
            throw new appError_1.default("Building not found", 404);
        }
        if (!building.deletedAt) {
            throw new appError_1.default("Building is not deleted", 400);
        }
        const restoredBuilding = await prisma_1.prisma.building.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedBy: ownerId,
            },
            include: {
                property: true,
                address: true,
            },
        });
        return restoredBuilding;
    }
}
exports.BuildingService = BuildingService;
exports.default = new BuildingService();
