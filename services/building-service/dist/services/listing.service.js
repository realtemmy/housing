"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class ListingService {
    // Get listing data for a specific entity
    async getListing(listingType, entityId) {
        let listingData;
        switch (listingType) {
            case 'property':
                const property = await prisma_1.prisma.property.findUnique({
                    where: { id: entityId },
                });
                if (!property) {
                    throw new appError_1.default("Property not found", 404);
                }
                listingData = {
                    id: property.id,
                    type: 'property',
                    listingTitle: property.listingTitle ?? null,
                    listingDescription: property.listingDescription ?? null,
                    listingStatus: property.listingStatus,
                    listingViews: property.listingViews,
                    isFeatured: property.isFeatured ?? false,
                    virtualTourUrl: property.virtualTourUrl ?? null,
                    amenities: property.amenities,
                    propertyId: property.id,
                    title: property.title,
                    description: property.description ?? null,
                    isActive: property.isActive,
                    verificationStatus: property.verificationStatus,
                    ownerId: property.ownerId,
                };
                break;
            case 'unit':
                const unit = await prisma_1.prisma.unit.findUnique({
                    where: { id: entityId },
                    include: {
                        building: true,
                    },
                });
                if (!unit) {
                    throw new appError_1.default("Unit not found", 404);
                }
                listingData = {
                    id: unit.id,
                    type: 'unit',
                    listingTitle: unit.listingTitle ?? null,
                    listingDescription: unit.listingDescription ?? null,
                    listingStatus: unit.listingStatus,
                    listingViews: unit.listingViews,
                    isFeatured: unit.isFeatured ?? false,
                    virtualTourUrl: unit.virtualTourUrl ?? null,
                    amenities: unit.amenities,
                    unitNumber: unit.unitNumber,
                    summary: unit.summary ?? null,
                    type: unit.type,
                    rentAmount: unit.rentAmount,
                    depositAmount: unit.depositAmount,
                    status: unit.status,
                    floor: unit.floor,
                    bedrooms: unit.bedrooms,
                    bathrooms: unit.bathrooms,
                    sqft: unit.sqft,
                    buildingId: unit.buildingId,
                    propertyId: unit.propertyId,
                };
                break;
            case 'room':
                const room = await prisma_1.prisma.room.findUnique({
                    where: { id: entityId },
                    include: {
                        unit: true,
                    },
                });
                if (!room) {
                    throw new appError_1.default("Room not found", 404);
                }
                listingData = {
                    id: room.id,
                    type: 'room',
                    listingTitle: room.listingTitle ?? null,
                    listingDescription: room.listingDescription ?? null,
                    listingStatus: room.listingStatus,
                    listingViews: room.listingViews,
                    isFeatured: room.isFeatured ?? false,
                    virtualTourUrl: room.virtualTourUrl ?? null,
                    amenities: room.amenities,
                    name: room.name,
                    description: room.description ?? null,
                    summary: room.summary ?? null,
                    size: room.size,
                    type: room.type,
                    rentAmount: room.rentAmount,
                    depositAmount: room.depositAmount,
                    status: room.status,
                    occupantId: room.occupantId,
                    initializedAt: room.initializedAt,
                    unitId: room.unitId,
                    propertyId: room.propertyId,
                };
                break;
            case 'bed':
                const bed = await prisma_1.prisma.bed.findUnique({
                    where: { id: entityId },
                    include: {
                        room: true,
                    },
                });
                if (!bed) {
                    throw new appError_1.default("Bed not found", 404);
                }
                listingData = {
                    id: bed.id,
                    type: 'bed',
                    listingTitle: bed.listingTitle ?? null,
                    listingDescription: bed.listingDescription ?? null,
                    listingStatus: bed.listingStatus,
                    listingViews: bed.listingViews,
                    isFeatured: bed.isFeatured ?? false,
                    virtualTourUrl: bed.virtualTourUrl ?? null,
                    amenities: bed.amenities,
                    label: bed.label,
                    rentAmount: bed.rentAmount,
                    depositAmount: bed.depositAmount,
                    status: bed.status,
                    occupantId: bed.occupantId,
                    initializedAt: bed.initializedAt,
                    roomId: bed.roomId,
                    propertyId: bed.propertyId,
                };
                break;
        }
        return listingData;
    }
    // Update listing data for a specific entity
    async updateListing(listingType, entityId, input) {
        // First get the current listing data to return it after update
        const currentListing = await this.getListing(listingType, entityId);
        let updatedEntity;
        switch (listingType) {
            case 'property':
                updatedEntity = await prisma_1.prisma.property.update({
                    where: { id: entityId },
                    data: {
                        ...(input.listingTitle !== undefined && { listingTitle: input.listingTitle }),
                        ...(input.listingDescription !== undefined && { listingDescription: input.listingDescription }),
                        ...(input.listingStatus !== undefined && { listingStatus: input.listingStatus }),
                        ...(input.listingViews !== undefined && { listingViews: input.listingViews }),
                        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                        ...(input.virtualTourUrl !== undefined && { virtualTourUrl: input.virtualTourUrl }),
                        ...(input.amenities !== undefined && { amenities: input.amenities }),
                    },
                });
                break;
            case 'unit':
                updatedEntity = await prisma_1.prisma.unit.update({
                    where: { id: entityId },
                    data: {
                        ...(input.listingTitle !== undefined && { listingTitle: input.listingTitle }),
                        ...(input.listingDescription !== undefined && { listingDescription: input.listingDescription }),
                        ...(input.listingStatus !== undefined && { listingStatus: input.listingStatus }),
                        ...(input.listingViews !== undefined && { listingViews: input.listingViews }),
                        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                        ...(input.virtualTourUrl !== undefined && { virtualTourUrl: input.virtualTourUrl }),
                        ...(input.amenities !== undefined && { amenities: input.amenities }),
                    },
                });
                break;
            case 'room':
                updatedEntity = await prisma_1.prisma.room.update({
                    where: { id: entityId },
                    data: {
                        ...(input.listingTitle !== undefined && { listingTitle: input.listingTitle }),
                        ...(input.listingDescription !== undefined && { listingDescription: input.listingDescription }),
                        ...(input.listingStatus !== undefined && { listingStatus: input.listingStatus }),
                        ...(input.listingViews !== undefined && { listingViews: input.listingViews }),
                        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                        ...(input.virtualTourUrl !== undefined && { virtualTourUrl: input.virtualTourUrl }),
                        ...(input.amenities !== undefined && { amenities: input.amenities }),
                    },
                });
                break;
            case 'bed':
                updatedEntity = await prisma_1.prisma.bed.update({
                    where: { id: entityId },
                    data: {
                        ...(input.listingTitle !== undefined && { listingTitle: input.listingTitle }),
                        ...(input.listingDescription !== undefined && { listingDescription: input.listingDescription }),
                        ...(input.listingStatus !== undefined && { listingStatus: input.listingStatus }),
                        ...(input.listingViews !== undefined && { listingViews: input.listingViews }),
                        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                        ...(input.virtualTourUrl !== undefined && { virtualTourUrl: input.virtualTourUrl }),
                        ...(input.amenities !== undefined && { amenities: input.amenities }),
                    },
                });
                break;
        }
        // Return the updated listing data
        return this.getListing(listingType, entityId);
    }
    // Get multiple listings with filtering and pagination
    async getListings(listingType, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // We'll need to query each type separately and combine results
        // This is not optimal for large datasets but works for now
        let allListings = [];
        let totalItems = 0;
        const typesToQuery = listingType
            ? [listingType]
            : ['property', 'unit', 'room', 'bed'];
        for (const type of typesToQuery) {
            let typeItems = [];
            let typeTotal = 0;
            switch (type) {
                case 'property':
                    const propertyWhere = {
                        ...(options.listingStatus && { listingStatus: options.listingStatus }),
                        ...(options.isFeatured !== undefined && { isFeatured: options.isFeatured }),
                        ...(options.minViews !== undefined && { listingViews: { gte: options.minViews } }),
                    };
                    const [typeTotalItems, properties] = await prisma_1.prisma.$transaction([
                        prisma_1.prisma.property.count({ where: propertyWhere }),
                        prisma_1.prisma.property.findMany({
                            skip,
                            take: limit,
                            where: propertyWhere,
                            orderBy: { listingViews: 'desc' },
                        }),
                    ]);
                    typeTotal = typeTotalItems;
                    typeItems = properties.map(prop => ({
                        id: prop.id,
                        type: 'property',
                        listingTitle: prop.listingTitle ?? null,
                        listingDescription: prop.listingDescription ?? null,
                        listingStatus: prop.listingStatus,
                        listingViews: prop.listingViews,
                        isFeatured: prop.isFeatured ?? false,
                        virtualTourUrl: prop.virtualTourUrl ?? null,
                        amenities: prop.amenities,
                        propertyId: prop.id,
                        title: prop.title,
                        description: prop.description ?? null,
                        isActive: prop.isActive,
                        verificationStatus: prop.verificationStatus,
                        ownerId: prop.ownerId,
                    }));
                    break;
                case 'unit':
                    const unitWhere = {
                        ...(options.listingStatus && { listingStatus: options.listingStatus }),
                        ...(options.isFeatured !== undefined && { isFeatured: options.isFeatured }),
                        ...(options.minViews !== undefined && { listingViews: { gte: options.minViews } }),
                    };
                    const [typeTotalItems, units] = await prisma_1.prisma.$transaction([
                        prisma_1.prisma.unit.count({ where: unitWhere }),
                        prisma_1.prisma.unit.findMany({
                            skip,
                            take: limit,
                            where: unitWhere,
                            orderBy: { listingViews: 'desc' },
                            include: {
                                building: true,
                            },
                        }),
                    ]);
                    typeTotal = typeTotalItems;
                    typeItems = units.map(unit => ({
                        id: unit.id,
                        type: 'unit',
                        listingTitle: unit.listingTitle ?? null,
                        listingDescription: unit.listingDescription ?? null,
                        listingStatus: unit.listingStatus,
                        listingViews: unit.listingViews,
                        isFeatured: unit.isFeatured ?? false,
                        virtualTourUrl: unit.virtualTourUrl ?? null,
                        amenities: unit.amenities,
                        unitNumber: unit.unitNumber,
                        summary: unit.summary ?? null,
                        type: unit.type,
                        rentAmount: unit.rentAmount,
                        depositAmount: unit.depositAmount,
                        status: unit.status,
                        floor: unit.floor,
                        bedrooms: unit.bedrooms,
                        bathrooms: unit.bathrooms,
                        sqft: unit.sqft,
                        buildingId: unit.buildingId,
                        propertyId: unit.propertyId,
                    }));
                    break;
                case 'room':
                    const roomWhere = {
                        ...(options.listingStatus && { listingStatus: options.listingStatus }),
                        ...(options.isFeatured !== undefined && { isFeatured: options.isFeatured }),
                        ...(options.minViews !== undefined && { listingViews: { gte: options.minViews } }),
                    };
                    const [typeTotalItems, rooms] = await prisma_1.prisma.$transaction([
                        prisma_1.prisma.room.count({ where: roomWhere }),
                        prisma_1.prisma.room.findMany({
                            skip,
                            take: limit,
                            where: roomWhere,
                            orderBy: { listingViews: 'desc' },
                            include: {
                                unit: true,
                            },
                        }),
                    ]);
                    typeTotal = typeTotalItems;
                    typeItems = rooms.map(room => ({
                        id: room.id,
                        type: 'room',
                        listingTitle: room.listingTitle ?? null,
                        listingDescription: room.listingDescription ?? null,
                        listingStatus: room.listingStatus,
                        listingViews: room.listingViews,
                        isFeatured: room.isFeatured ?? false,
                        virtualTourUrl: room.virtualTourUrl ?? null,
                        amenities: room.amenities,
                        name: room.name,
                        description: room.description ?? null,
                        summary: room.summary ?? null,
                        size: room.size,
                        type: room.type,
                        rentAmount: room.rentAmount,
                        depositAmount: room.depositAmount,
                        status: room.status,
                        occupantId: room.occupantId,
                        initializedAt: room.initializedAt,
                        unitId: room.unitId,
                        propertyId: room.propertyId,
                    }));
                    break;
                case 'bed':
                    const bedWhere = {
                        ...(options.listingStatus && { listingStatus: options.listingStatus }),
                        ...(options.isFeatured !== undefined && { isFeatured: options.isFeatured }),
                        ...(options.minViews !== undefined && { listingViews: { gte: options.minViews } }),
                    };
                    const [typeTotalItems, beds] = await prisma_1.prisma.$transaction([
                        prisma_1.prisma.bed.count({ where: bedWhere }),
                        prisma_1.prisma.bed.findMany({
                            skip,
                            take: limit,
                            where: bedWhere,
                            orderBy: { listingViews: 'desc' },
                            include: {
                                room: true
                            }
                        })
                    ]);
                    typeTotal = typeTotalItems;
                    typeItems = beds.map(bed => ({
                        id: bed.id,
                        type: 'bed',
                        listingTitle: bed.listingTitle ?? null,
                        listingDescription: bed.listingDescription ?? null,
                        listingStatus: bed.listingStatus,
                        listingViews: bed.listingViews,
                        isFeatured: bed.isFeatured ?? false,
                        virtualTourUrl: bed.virtualTourUrl ?? null,
                        amenities: bed.amenities,
                        label: bed.label,
                        rentAmount: bed.rentAmount,
                        depositAmount: bed.depositAmount,
                        status: bed.status,
                        occupantId: bed.occupantId,
                        initializedAt: bed.initializedAt,
                        roomId: bed.roomId,
                        propertyId: bed.propertyId,
                    }));
                    break;
            }
            allListings = [...allListings, ...typeItems];
            totalItems += typeTotal;
        }
        // Sort by listingViews descending
        allListings.sort((a, b) => b.listingViews - a.listingViews);
        // Apply pagination to the combined results
        const paginatedItems = allListings.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: paginatedItems,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
}
exports.ListingService = ListingService;
exports.default = new ListingService();
