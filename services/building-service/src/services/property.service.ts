import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export interface GetPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: "asc" | "desc";
  includeDeleted?: boolean;
}

export interface CreatePropertyInput {
  title: string;
  description?: string | null;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    longitude?: number;
    latitude?: number;
  };
  purchasePrice?: number;
  currentValue?: number;
}

export interface UpdatePropertyInput {
  title?: string;
  description?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    longitude?: number;
    latitude?: number;
  };
  purchasePrice?: number;
  currentValue?: number;
  verificationStatus?: string;
  verificationNotes?: string;
  isActive?: boolean;
}

export class PropertyService {
  async getAllProperties(ownerId: string, options: GetPropertiesOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const search = options.search || "";
    const orderBy = options.orderBy === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    // Build where clause - exclude soft deleted records unless includeDeleted is true
    const whereClause: any = {
      ownerId,
      ...(options.includeDeleted ? {} : { deletedAt: null }),
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const [totalItems, properties] = await prisma.$transaction([
      prisma.property.count({ where: whereClause }),
      prisma.property.findMany({
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

  async getPropertyById(id: string, ownerId: string) {
    const property = await prisma.property.findFirst({
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
      throw new AppError("Property not found", 404);
    }

    return property;
  }

  async createProperty(ownerId: string, input: CreatePropertyInput) {
    // Create address if provided
    let addressId: string | undefined;
    if (input.address) {
      const address = await prisma.address.create({
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

    const property = await prisma.property.create({
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

  async updateProperty(id: string, ownerId: string, input: UpdatePropertyInput) {
    const property = await prisma.property.findFirst({
      where: { id, ownerId, deletedAt: null },
    });

    if (!property) {
      throw new AppError("Property not found or unauthorized", 404);
    }

    // Handle address updates if provided
    let addressConnect: { connect: { id: string } } | { disconnect: true } | undefined;
    if (input.address !== undefined) {
      if (input.address === null) {
        // Remove existing address
        addressConnect = { disconnect: true };
      } else {
        // Update or create address
        let addressId: string | undefined;
        if (property.address) {
          // Update existing address
          await prisma.address.update({
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
        } else {
          // Create new address
          const address = await prisma.address.create({
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

    const updatedProperty = await prisma.property.update({
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

  async softDeleteProperty(id: string, ownerId: string) {
    const property = await prisma.property.findFirst({
      where: { id, ownerId, deletedAt: null },
    });

    if (!property) {
      throw new AppError("Property not found or unauthorized", 404);
    }

    // Check if property has any active buildings/units/rooms/beds
    const [buildingCount, unitCount, roomCount, bedCount] = await prisma.$transaction([
      prisma.building.count({ where: { propertyId: id } }),
      prisma.unit.count({ where: { propertyId: id } }),
      prisma.room.count({ where: { propertyId: id } }),
      prisma.bed.count({ where: { propertyId: id } }),
    ]);

    if (buildingCount > 0 || unitCount > 0 || roomCount > 0 || bedCount > 0) {
      throw new AppError("Cannot delete property with existing buildings, units, rooms, or beds. Delete them first.", 400);
    }

    const deletedProperty = await prisma.property.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: ownerId,
      },
    });

    return deletedProperty;
  }

  async restoreProperty(id: string, ownerId: string) {
    const property = await prisma.property.findFirst({
      where: { id, ownerId },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    if (!property.deletedAt) {
      throw new AppError("Property is not deleted", 400);
    }

    const restoredProperty = await prisma.property.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy: ownerId,
      },
    });

    return restoredProperty;
  }
}

export default new PropertyService();