import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateBuildingInput {
  propertyId: string;
  name: string;
  description?: string | null;
  summary?: string | null;
  floors?: number | null;
  address: AddressInput;
}

export interface UpdateBuildingInput {
  name?: string;
  description?: string | null;
  summary?: string | null;
  floors?: number | null;
}

export interface GetBuildingsOptions {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
  orderBy?: "asc" | "desc";
}

export class BuildingService {
  async getAllBuildings(ownerId: string, options: GetBuildingsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const search = options.search || "";
    const orderBy = options.orderBy === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    const whereClause = {
      property: {
        ownerId,
      },
      ...(options.propertyId ? { propertyId: options.propertyId } : {}),
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const [totalItems, buildings] = await prisma.$transaction([
      prisma.building.count({ where: whereClause }),
      prisma.building.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: orderBy },
        include: {
          _count: { select: { units: true } },
          property: { select: { id: true, title: true } },
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

  async getBuildingById(id: string, ownerId: string) {
    const building = await prisma.building.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        _count: { select: { units: true } },
        address: true,
        units: true,
        property: { select: { id: true, title: true, ownerId: true } },
      },
    });

    if (!building) {
      throw new AppError("Building not found", 404);
    }

    return building;
  }

  async createBuilding(ownerId: string, input: CreateBuildingInput) {
    const property = await prisma.property.findFirst({
      where: { id: input.propertyId, ownerId },
    });

    if (!property) {
      throw new AppError("Property not found or unauthorized", 404);
    }

    const building = await prisma.building.create({
      data: {
        propertyId: input.propertyId,
        name: input.name,
        floors: input.floors ?? 0,
        description: input.description ?? null,
        summary: input.summary ?? null,
        address: {
          create: {
            street: input.address.street,
            city: input.address.city,
            state: input.address.state,
            postalCode: input.address.postalCode,
            country: input.address.country,
            latitude: input.address.latitude ?? null,
            longitude: input.address.longitude ?? null,
          },
        },
      },
      include: {
        property: true,
        address: true,
      },
    });

    return building;
  }

  async updateBuilding(id: string, ownerId: string, input: UpdateBuildingInput) {
    const building = await prisma.building.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!building) {
      throw new AppError("Building not found or unauthorized", 404);
    }

    const updatedBuilding = await prisma.building.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.summary !== undefined && { summary: input.summary }),
        ...(input.floors !== undefined && { floors: input.floors }),
      },
      include: {
        property: true,
        address: true,
        units: true,
      },
    });

    return updatedBuilding;
  }

  async deleteBuilding(id: string, ownerId: string) {
    const building = await prisma.building.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        units: true,
      },
    });

    if (!building) {
      throw new AppError("Building not found or unauthorized", 404);
    }

    if (building.units.length > 0) {
      throw new AppError("Cannot delete building with existing units. Delete units first.", 400);
    }

    await prisma.building.delete({
      where: { id },
    });
  }
}

export default new BuildingService();
