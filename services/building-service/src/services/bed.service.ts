import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { AvailableStatus } from "../generated/prisma/client";

export interface CreateBedInput {
  label: string;
  rentAmount: number;
  depositAmount?: number | null;
  status?: AvailableStatus;
  roomId: string;
  occupantId?: string | null;
}

export interface UpdateBedInput {
  label?: string;
  rentAmount?: number;
  depositAmount?: number | null;
  status?: AvailableStatus;
  occupantId?: string | null;
}

export interface GetBedsOptions {
  page?: number;
  limit?: number;
  roomId?: string;
  propertyId?: string;
  status?: string;
}

export class BedService {
  async getAllBeds(ownerId: string, options: GetBedsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      property: {
        ownerId,
      },
    };

    if (options.roomId) whereClause.roomId = options.roomId;
    if (options.propertyId) whereClause.propertyId = options.propertyId;
    if (options.status) whereClause.status = options.status as AvailableStatus;

    const [totalItems, beds] = await prisma.$transaction([
      prisma.bed.count({ where: whereClause }),
      prisma.bed.findMany({
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

  async getBedById(id: string, ownerId: string) {
    const bed = await prisma.bed.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        room: { select: { id: true, name: true, unitId: true } },
        property: { select: { id: true, title: true } },
      },
    });

    if (!bed) {
      throw new AppError("Bed not found", 404);
    }

    return bed;
  }

  async createBed(ownerId: string, input: CreateBedInput) {
    const room = await prisma.room.findFirst({
      where: {
        id: input.roomId,
        property: { ownerId },
      },
      include: {
        property: true,
      },
    });

    if (!room) {
      throw new AppError("Room not found or unauthorized", 404);
    }

    const bed = await prisma.bed.create({
      data: {
        label: input.label,
        rentAmount: input.rentAmount,
        depositAmount: input.depositAmount ?? null,
        status: input.status ?? "AVAILABLE",
        roomId: input.roomId,
        propertyId: room.propertyId,
        occupantId: input.occupantId ?? null,
      },
      include: {
        room: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return bed;
  }

  async updateBed(id: string, ownerId: string, input: UpdateBedInput) {
    const existingBed = await prisma.bed.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!existingBed) {
      throw new AppError("Bed not found or unauthorized", 404);
    }

    const updatedBed = await prisma.bed.update({
      where: { id },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.rentAmount !== undefined && { rentAmount: input.rentAmount }),
        ...(input.depositAmount !== undefined && { depositAmount: input.depositAmount }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
      },
      include: {
        room: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return updatedBed;
  }

  async deleteBed(id: string, ownerId: string) {
    const bed = await prisma.bed.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!bed) {
      throw new AppError("Bed not found or unauthorized", 404);
    }

    await prisma.bed.delete({
      where: { id },
    });
  }
}

export default new BedService();
