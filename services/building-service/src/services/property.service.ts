import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export interface GetPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: "asc" | "desc";
}

export interface CreatePropertyInput {
  title: string;
  description?: string | null;
}

export interface UpdatePropertyInput {
  title?: string;
  description?: string | null;
}

export class PropertyService {
  async getAllProperties(ownerId: string, options: GetPropertiesOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const search = options.search || "";
    const orderBy = options.orderBy === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    const whereClause = {
      ownerId,
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
            select: { buildings: true, units: true },
          },
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
      where: { id, ownerId },
      include: {
        _count: {
          select: { buildings: true, units: true },
        },
        buildings: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    return property;
  }

  async createProperty(ownerId: string, input: CreatePropertyInput) {
    const property = await prisma.property.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        ownerId,
      },
    });

    return property;
  }

  async updateProperty(id: string, ownerId: string, input: UpdatePropertyInput) {
    const property = await prisma.property.findFirst({
      where: { id, ownerId },
    });

    if (!property) {
      throw new AppError("Property not found or unauthorized", 404);
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });

    return updatedProperty;
  }

  async deleteProperty(id: string, ownerId: string) {
    const property = await prisma.property.findFirst({
      where: { id, ownerId },
      include: { buildings: true, units: true },
    });

    if (!property) {
      throw new AppError("Property not found or unauthorized", 404);
    }

    if (property.buildings.length > 0 || property.units.length > 0) {
      throw new AppError("Cannot delete property with existing buildings or units. Delete them first.", 400);
    }

    await prisma.property.delete({
      where: { id },
    });
  }
}

export default new PropertyService();
