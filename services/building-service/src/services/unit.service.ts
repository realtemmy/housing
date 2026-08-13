import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { AvailableStatus, UnitType } from "../generated/prisma/client";

export interface CreateUnitInput {
  unitNumber: string;
  summary?: string | null;
  type?: UnitType;
  floor?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  status?: AvailableStatus;
  rentAmount?: number | null;
  depositAmount?: number | null;
  buildingId: string;
  propertyId?: string;
}

export interface UpdateUnitInput {
  unitNumber?: string;
  summary?: string | null;
  type?: UnitType;
  floor?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  status?: AvailableStatus;
  rentAmount?: number | null;
  depositAmount?: number | null;
  buildingId?: string;
  occupantId?: string | null;
}

export interface GetUnitsOptions {
  page?: number;
  limit?: number;
  propertyId?: string;
  buildingId?: string;
  status?: string;
}

export class UnitService {
  async getAllUnits(ownerId: string, options: GetUnitsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      property: {
        ownerId,
      },
    };

    if (options.propertyId) whereClause.propertyId = options.propertyId;
    if (options.buildingId) whereClause.buildingId = options.buildingId;
    if (options.status) whereClause.status = options.status as AvailableStatus;

    const [totalItems, units] = await prisma.$transaction([
      prisma.unit.count({ where: whereClause }),
      prisma.unit.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          photos: true,
          building: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } },
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

  async getUnitById(id: string, ownerId: string) {
    const unit = await prisma.unit.findFirst({
      where: {
        id,
        property: { ownerId },
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
      throw new AppError("Unit not found", 404);
    }

    return unit;
  }

  async checkUnitAvailability(id: string, ownerId?: string) {
    const now = new Date();
    const unit = await prisma.unit.findFirst({
      where: {
        id,
        ...(ownerId ? { property: { ownerId } } : {}),
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
      await prisma.unit.update({
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

  async createUnit(ownerId: string, input: CreateUnitInput) {
    // Verify building exists and belongs to owner
    const building = await prisma.building.findFirst({
      where: {
        id: input.buildingId,
        property: { ownerId },
      },
      include: {
        property: true,
      },
    });

    if (!building) {
      throw new AppError("Building not found or unauthorized", 404);
    }

    const propertyId = input.propertyId || building.propertyId;

    const unit = await prisma.unit.create({
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
      },
      include: {
        building: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return unit;
  }

  async updateUnit(id: string, ownerId: string, input: UpdateUnitInput) {
    const existingUnit = await prisma.unit.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!existingUnit) {
      throw new AppError("Unit not found or unauthorized", 404);
    }

    if (input.buildingId && input.buildingId !== existingUnit.buildingId) {
      const building = await prisma.building.findFirst({
        where: {
          id: input.buildingId,
          property: { ownerId },
        },
      });
      if (!building) {
        throw new AppError("Target building not found or unauthorized", 404);
      }
    }

    const updatedUnit = await prisma.unit.update({
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
        ...(input.rentAmount !== undefined && { rentAmount: input.rentAmount }),
        ...(input.depositAmount !== undefined && { depositAmount: input.depositAmount }),
        ...(input.buildingId !== undefined && { buildingId: input.buildingId }),
        ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
      },
      include: {
        building: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return updatedUnit;
  }

  async deleteUnit(id: string, ownerId: string) {
    const unit = await prisma.unit.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        rooms: true,
      },
    });

    if (!unit) {
      throw new AppError("Unit not found or unauthorized", 404);
    }

    if (unit.rooms.length > 0) {
      throw new AppError("Cannot delete unit with existing rooms. Delete rooms first.", 400);
    }

    await prisma.unit.delete({
      where: { id },
    });
  }
}

export default new UnitService();
