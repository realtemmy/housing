import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import { PropertyType, InventoryStatus, MediaCategory } from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class PropertyService {
  static async createProperty(ownerId: string, data: {
    title: string;
    description?: string;
    propertyType: PropertyType;
    addressStreet: string;
    area: string;
    city: string;
    state: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const prisma = await getPrismaClient();

    const property = await prisma.property.create({
      data: {
        ...data,
        ownerId,
        verificationStatus: "UNVERIFIED",
        isActive: true,
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    return property;
  }

  static async listProperties(params: {
    userId?: string;
    ownerOnly?: boolean;
    area?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(params);

    const where: any = { isActive: true, deletedAt: null };

    if (params.ownerOnly && params.userId) {
      where.OR = [
        { ownerId: params.userId },
        { agentAssignments: { some: { agentId: params.userId, isActive: true } } },
      ];
    }

    if (params.area) {
      where.area = { contains: params.area, mode: "insensitive" };
    }

    if (params.city) {
      where.city = { contains: params.city, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          media: {
            where: { isCover: true },
            take: 1,
          },
          _count: {
            select: { units: true, buildings: true },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getPropertyById(propertyId: string) {
    const prisma = await getPrismaClient();

    const property = await prisma.property.findUnique({
      where: { id: propertyId, deletedAt: null },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        buildings: {
          include: {
            units: true,
          },
        },
        units: {
          include: {
            rooms: {
              include: {
                beds: true,
              },
            },
            media: true,
          },
        },
        media: {
          orderBy: { createdAt: "asc" },
        },
        agentAssignments: {
          where: { isActive: true },
          include: {
            agent: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundError("Property", propertyId);
    }

    return property;
  }

  static async updateProperty(propertyId: string, data: any) {
    const prisma = await getPrismaClient();

    const existing = await prisma.property.findUnique({ where: { id: propertyId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Property", propertyId);

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data,
    });

    return updated;
  }

  static async deleteProperty(propertyId: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.property.findUnique({ where: { id: propertyId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Property", propertyId);

    await prisma.property.update({
      where: { id: propertyId },
      data: { isActive: false, deletedAt: new Date() },
    });

    return { message: "Property successfully archived" };
  }

  // --- Buildings ---
  static async createBuilding(propertyId: string, data: { name: string; description?: string; floors?: number }) {
    const prisma = await getPrismaClient();
    return prisma.building.create({
      data: {
        propertyId,
        ...data,
      },
    });
  }

  static async updateBuilding(buildingId: string, data: any, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.building.findUnique({ where: { id: buildingId } });
    if (!existing) throw new NotFoundError("Building", buildingId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return prisma.building.update({
      where: { id: buildingId },
      data,
    });
  }

  static async deleteBuilding(buildingId: string, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.building.findUnique({ where: { id: buildingId } });
    if (!existing) throw new NotFoundError("Building", buildingId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId);
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    await prisma.building.delete({ where: { id: buildingId } });
    return { message: "Building deleted successfully" };
  }

  // --- Units ---
  static async createUnit(propertyId: string, data: {
    buildingId?: string;
    unitNumber: string;
    floor?: number;
    bedrooms: number;
    bathrooms: number;
    sqft?: number;
    rentAmount: number;
    cautionDeposit: number;
    serviceCharge?: number;
    status?: InventoryStatus;
  }) {
    const prisma = await getPrismaClient();

    const existing = await prisma.unit.findUnique({
      where: {
        propertyId_unitNumber: {
          propertyId,
          unitNumber: data.unitNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictError(`Unit '${data.unitNumber}' already exists on this property`);
    }

    return prisma.unit.create({
      data: {
        propertyId,
        buildingId: data.buildingId,
        unitNumber: data.unitNumber,
        floor: data.floor,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        rentAmount: data.rentAmount,
        cautionDeposit: data.cautionDeposit,
        serviceCharge: data.serviceCharge || 0,
        status: data.status || InventoryStatus.AVAILABLE,
      },
    });
  }

  static async updateUnit(unitId: string, data: any, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!existing) throw new NotFoundError("Unit", unitId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return prisma.unit.update({
      where: { id: unitId },
      data,
    });
  }

  static async deleteUnit(unitId: string, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!existing) throw new NotFoundError("Unit", unitId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId);
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    await prisma.unit.delete({ where: { id: unitId } });
    return { message: "Unit deleted successfully" };
  }

  // --- Rooms ---
  static async createRoom(propertyId: string, unitId: string, data: {
    name: string;
    type?: string;
    size?: number;
    rentAmount: number;
    cautionDeposit?: number;
    status?: InventoryStatus;
  }) {
    const prisma = await getPrismaClient();

    const existing = await prisma.room.findUnique({
      where: {
        unitId_name: {
          unitId,
          name: data.name,
        },
      },
    });

    if (existing) {
      throw new ConflictError(`Room '${data.name}' already exists in this unit`);
    }

    return prisma.room.create({
      data: {
        propertyId,
        unitId,
        name: data.name,
        type: data.type,
        size: data.size,
        rentAmount: data.rentAmount,
        cautionDeposit: data.cautionDeposit || 0,
        status: data.status || InventoryStatus.AVAILABLE,
      },
    });
  }

  static async updateRoom(roomId: string, data: any, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.room.findUnique({ where: { id: roomId } });
    if (!existing) throw new NotFoundError("Room", roomId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return prisma.room.update({
      where: { id: roomId },
      data,
    });
  }

  static async deleteRoom(roomId: string, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.room.findUnique({ where: { id: roomId } });
    if (!existing) throw new NotFoundError("Room", roomId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId);
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    await prisma.room.delete({ where: { id: roomId } });
    return { message: "Room deleted successfully" };
  }

  // --- Beds ---
  static async createBed(propertyId: string, roomId: string, data: {
    label: string;
    rentAmount: number;
    cautionDeposit?: number;
    status?: InventoryStatus;
  }) {
    const prisma = await getPrismaClient();

    const existing = await prisma.bed.findUnique({
      where: {
        roomId_label: {
          roomId,
          label: data.label,
        },
      },
    });

    if (existing) {
      throw new ConflictError(`Bed '${data.label}' already exists in this room`);
    }

    return prisma.bed.create({
      data: {
        propertyId,
        roomId,
        label: data.label,
        rentAmount: data.rentAmount,
        cautionDeposit: data.cautionDeposit,
        status: data.status || InventoryStatus.AVAILABLE,
      },
    });
  }

  static async updateBed(bedId: string, data: any, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.bed.findUnique({ where: { id: bedId } });
    if (!existing) throw new NotFoundError("Bed", bedId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return prisma.bed.update({
      where: { id: bedId },
      data,
    });
  }

  static async deleteBed(bedId: string, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.bed.findUnique({ where: { id: bedId } });
    if (!existing) throw new NotFoundError("Bed", bedId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId);
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    await prisma.bed.delete({ where: { id: bedId } });
    return { message: "Bed deleted successfully" };
  }

  // --- Media ---
  static async addMedia(propertyId: string, data: {
    url: string;
    category?: MediaCategory;
    caption?: string;
    isCover?: boolean;
    unitId?: string;
  }) {
    const prisma = await getPrismaClient();
    return prisma.propertyMedia.create({
      data: {
        propertyId,
        url: data.url,
        category: data.category || MediaCategory.PHOTO,
        caption: data.caption,
        isCover: data.isCover || false,
        unitId: data.unitId,
      },
    });
  }

  static async removeMedia(mediaId: string, userId?: string) {
    const prisma = await getPrismaClient();
    const existing = await prisma.propertyMedia.findUnique({ where: { id: mediaId } });
    if (!existing) throw new NotFoundError("PropertyMedia", mediaId);

    if (userId) {
      const hasAccess = await verifyPropertyAccess(existing.propertyId, userId, "canManageListings");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    await prisma.propertyMedia.delete({ where: { id: mediaId } });
    return { message: "Media deleted successfully" };
  }

  // --- Inventory Availability Check ---
  static async checkAvailability(type: "UNIT" | "ROOM" | "BED", id: string) {
    const prisma = await getPrismaClient();
    if (type === "UNIT") {
      const unit = await prisma.unit.findUnique({ where: { id } });
      if (!unit) throw new NotFoundError("Unit", id);
      return { available: unit.status === InventoryStatus.AVAILABLE, status: unit.status };
    } else if (type === "ROOM") {
      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) throw new NotFoundError("Room", id);
      return { available: room.status === InventoryStatus.AVAILABLE, status: room.status };
    } else if (type === "BED") {
      const bed = await prisma.bed.findUnique({ where: { id } });
      if (!bed) throw new NotFoundError("Bed", id);
      return { available: bed.status === InventoryStatus.AVAILABLE, status: bed.status };
    }
    throw new BadRequestError("Invalid inventory type");
  }
}
