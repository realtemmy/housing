"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class PropertyService {
    async getAllProperties(ownerId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const search = options.search || "";
        const orderBy = options.orderBy === "asc" ? "asc" : "desc";
        const skip = (page - 1) * limit;
        // Build where clause - exclude soft deleted records unless includeDeleted is true
        const whereClause = {
            ownerId,
            ...(options.includeDeleted ? {} : { deletedAt: null }),
            title: {
                contains: search,
                mode: "insensitive",
            },
        };
        const [totalItems, properties] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.property.count({ where: whereClause }),
            prisma_1.prisma.property.findMany({
                skip,
                take: limit,
                where: whereClause,
                orderBy: { createdAt: orderBy },
                include: {
                    _count: {
                        select: { buildings: true, units: true, rooms: true },
                    },
                    buildings: {
                        include: {
                            address: true,
                        },
                    },
                    address: true,
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: properties,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getPropertyById(id, ownerId) {
        const property = await prisma_1.prisma.property.findFirst({
            where: { id, ownerId, deletedAt: null },
            include: {
                _count: {
                    select: { buildings: true, units: true, rooms: true },
                },
                buildings: {
                    include: {
                        address: true,
                    },
                },
                address: true,
            },
        });
        if (!property) {
            throw new appError_1.default("Property not found", 404);
        }
        return property;
    }
    async createProperty(ownerId, input) {
        // Create address if provided
        let addressId;
        if (input.address) {
            const address = await prisma_1.prisma.address.create({
                data: {
                    street: input.address.street,
                    city: input.address.city,
                    state: input.address.state,
                    postalCode: input.address.postalCode,
                    country: input.address.country,
                    longitude: input.address.longitude,
                    latitude: input.address.latitude,
                },
            });
            addressId = address.id;
        }
        const property = await prisma_1.prisma.property.create({
            data: {
                title: input.title,
                description: input.description ?? null,
                ownerId,
                address: addressId ? { connect: { id: addressId } } : undefined,
                purchasePrice: input.purchasePrice ?? undefined,
                currentValue: input.currentValue ?? undefined,
                verificationStatus: "PENDING",
                isActive: true,
                createdBy: ownerId,
                updatedBy: ownerId,
            },
        });
        return property;
    }
    async updateProperty(id, ownerId, input) {
        const property = await prisma_1.prisma.property.findFirst({
            where: { id, ownerId, deletedAt: null },
        });
        if (!property) {
            throw new appError_1.default("Property not found or unauthorized", 404);
        }
        // Handle address updates if provided
        let addressConnect;
        if (input.address !== undefined) {
            if (input.address === null) {
                // Remove existing address
                addressConnect = { disconnect: true };
            }
            else {
                // Update or create address
                let addressId;
                if (property.address) {
                    // Update existing address
                    await prisma_1.prisma.address.update({
                        where: { id: property.address },
                        data: {
                            street: input.address.street,
                            city: input.address.city,
                            state: input.address.state,
                            postalCode: input.address.postalCode,
                            country: input.address.country,
                            longitude: input.address.longitude,
                            latitude: input.address.latitude,
                        },
                    });
                    addressId = property.address;
                }
                else {
                    // Create new address
                    const address = await prisma_1.prisma.address.create({
                        data: {
                            street: input.address.street,
                            city: input.address.city,
                            state: input.address.state,
                            postalCode: input.address.postalCode,
                            country: input.address.country,
                            longitude: input.address.longitude,
                            latitude: input.address.latitude,
                        },
                    });
                    addressId = address.id;
                }
                addressConnect = addressId ? { connect: { id: addressId } } : undefined;
            }
        }
        const updatedProperty = await prisma_1.prisma.property.update({
            where: { id },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.description !== undefined && { description: input.description }),
                ...(addressConnect !== undefined && { address: addressConnect }),
                ...(input.purchasePrice !== undefined && { purchasePrice: input.purchasePrice }),
                ...(input.currentValue !== undefined && { currentValue: input.currentValue }),
                ...(input.verificationStatus !== undefined && {
                    verificationStatus: input.verificationStatus,
                    ...(input.verificationStatus === "VERIFIED" && { verifiedAt: new Date() }),
                    ...(input.verificationStatus !== "VERIFIED" && { verifiedAt: null })
                }),
                ...(input.verificationNotes !== undefined && { verificationNotes: input.verificationNotes }),
                ...(input.isActive !== undefined && { isActive: input.isActive }),
                updatedBy: ownerId,
            },
        });
        return updatedProperty;
    }
    async softDeleteProperty(id, ownerId) {
        const property = await prisma_1.prisma.property.findFirst({
            where: { id, ownerId, deletedAt: null },
        });
        if (!property) {
            throw new appError_1.default("Property not found or unauthorized", 404);
        }
        // Check if property has any active buildings/units/rooms/beds
        const [buildingCount, unitCount, roomCount, bedCount] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.building.count({ where: { propertyId: id } }),
            prisma_1.prisma.unit.count({ where: { propertyId: id } }),
            prisma_1.prisma.room.count({ where: { propertyId: id } }),
            prisma_1.prisma.bed.count({ where: { propertyId: id } }),
        ]);
        if (buildingCount > 0 || unitCount > 0 || roomCount > 0 || bedCount > 0) {
            throw new appError_1.default("Cannot delete property with existing buildings, units, rooms, or beds. Delete them first.", 400);
        }
        const deletedProperty = await prisma_1.prisma.property.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: ownerId,
            },
        });
        return deletedProperty;
    }
    async restoreProperty(id, ownerId) {
        const property = await prisma_1.prisma.property.findFirst({
            where: { id, ownerId },
        });
        if (!property) {
            throw new appError_1.default("Property not found", 404);
        }
        if (!property.deletedAt) {
            throw new appError_1.default("Property is not deleted", 400);
        }
        const restoredProperty = await prisma_1.prisma.property.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedBy: ownerId,
            },
        });
        return restoredProperty;
    }
}
exports.PropertyService = PropertyService;
exports.default = new PropertyService();
