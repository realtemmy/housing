import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { AvailableStatus } from "../generated/prisma/client";
import { Prisma } from "../generated/prisma/client";

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
  includeDeleted?: boolean;
}

export class BedService {
  async getAllBeds(ownerId: string, options: GetBedsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause - exclude soft deleted records unless includeDeleted is true
    const whereClause: any = {
      property: {
        ownerId,
        ...(options.includeDeleted ? {} : { deletedAt: null }),
      },
      ...(options.includeDeleted ? {} : { deletedAt: null }),
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
        deletedAt: null,
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
        deletedAt: null,
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
        rentAmount: new Prisma.Decimal(input.rentAmount.toString()),
        depositAmount: input.depositAmount !== null && input.depositAmount !== undefined
          ? new Prisma.Decimal(input.depositAmount.toString())
          : null,
        status: input.status ?? "AVAILABLE",
        roomId: input.roomId,
        propertyId: room.propertyId,
        occupantId: input.occupantId ?? null,
        initializedAt: null,
        createdBy: ownerId,
        updatedBy: ownerId,
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
        deletedAt: null,
      },
    });

    if (!existingBed) {
      throw new AppError("Bed not found or unauthorized", 404);
    }

    const updatedBed = await prisma.bed.update({
      where: { id },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.rentAmount !== undefined && { rentAmount: new Prisma.Decimal(input.rentAmount.toString()) }),
        ...(input.depositAmount !== null && input.depositAmount !== undefined && { depositAmount: new Prisma.Decimal(input.depositAmount.toString()) }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
        updatedBy: ownerId,
      },
      include: {
        room: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return updatedBed;
  }

  async softDeleteBed(id: string, ownerId: string) {
    const bed = await prisma.bed.findFirst({
      where: {
        id,
        property: { ownerId },
        deletedAt: null,
      },
    });

    if (!bed) {
      throw new AppError("Bed not found or unauthorized", 404);
    }

    const deletedBed = await prisma.bed.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: ownerId,
      },
    });

    return deletedBed;
  }

  async restoreBed(id: string, ownerId: string) {
    const bed = await prisma.bed.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!bed) {
      throw new AppError("Bed not found", 404);
    }

    if (!bed.deletedAt) {
      throw new AppError("Bed is not deleted", 400);
    }

    const restoredBed = await prisma.bed.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy: ownerId,
      },
      include: {
        room: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return restoredBed;
  }
}

export default new BedService();