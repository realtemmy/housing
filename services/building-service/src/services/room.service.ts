import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { AvailableStatus } from "../generated/prisma/client";

export interface CreateRoomInput {
  name: string;
  description?: string | null;
  summary?: string | null;
  size?: number | null;
  type?: string | null;
  rentAmount?: number | null;
  depositAmount?: number | null;
  status?: AvailableStatus;
  unitId: string;
}

export interface UpdateRoomInput {
  name?: string;
  description?: string | null;
  summary?: string | null;
  size?: number | null;
  type?: string | null;
  rentAmount?: number | null;
  depositAmount?: number | null;
  status?: AvailableStatus;
  occupantId?: string | null;
}

export interface GetRoomsOptions {
  page?: number;
  limit?: number;
  unitId?: string;
  propertyId?: string;
  status?: string;
}

export class RoomService {
  async getAllRooms(ownerId: string, options: GetRoomsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      property: {
        ownerId,
      },
    };

    if (options.unitId) whereClause.unitId = options.unitId;
    if (options.propertyId) whereClause.propertyId = options.propertyId;
    if (options.status) whereClause.status = options.status as AvailableStatus;

    const [totalItems, rooms] = await prisma.$transaction([
      prisma.room.count({ where: whereClause }),
      prisma.room.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          beds: true,
          unit: { select: { id: true, unitNumber: true } },
          property: { select: { id: true, title: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: rooms,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getRoomById(id: string, ownerId: string) {
    const room = await prisma.room.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        beds: true,
        unit: { select: { id: true, unitNumber: true, buildingId: true } },
        property: { select: { id: true, title: true } },
      },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    return room;
  }

  async createRoom(ownerId: string, input: CreateRoomInput) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: input.unitId,
        property: { ownerId },
      },
      include: {
        property: true,
      },
    });

    if (!unit) {
      throw new AppError("Unit not found or unauthorized", 404);
    }

    const room = await prisma.room.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        summary: input.summary ?? null,
        size: input.size ?? null,
        type: input.type ?? null,
        rentAmount: input.rentAmount ?? null,
        depositAmount: input.depositAmount ?? null,
        status: input.status ?? "AVAILABLE",
        unitId: input.unitId,
        propertyId: unit.propertyId,
      },
      include: {
        unit: { select: { id: true, unitNumber: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return room;
  }

  async updateRoom(id: string, ownerId: string, input: UpdateRoomInput) {
    const existingRoom = await prisma.room.findFirst({
      where: {
        id,
        property: { ownerId },
      },
    });

    if (!existingRoom) {
      throw new AppError("Room not found or unauthorized", 404);
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.summary !== undefined && { summary: input.summary }),
        ...(input.size !== undefined && { size: input.size }),
        ...(input.type !== undefined && { type: input.type }),
        ...(input.rentAmount !== undefined && { rentAmount: input.rentAmount }),
        ...(input.depositAmount !== undefined && { depositAmount: input.depositAmount }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.occupantId !== undefined && { occupantId: input.occupantId }),
      },
      include: {
        beds: true,
        unit: { select: { id: true, unitNumber: true } },
      },
    });

    return updatedRoom;
  }

  async deleteRoom(id: string, ownerId: string) {
    const room = await prisma.room.findFirst({
      where: {
        id,
        property: { ownerId },
      },
      include: {
        beds: true,
      },
    });

    if (!room) {
      throw new AppError("Room not found or unauthorized", 404);
    }

    if (room.beds.length > 0) {
      throw new AppError("Cannot delete room with existing beds. Delete beds first.", 400);
    }

    await prisma.room.delete({
      where: { id },
    });
  }
}

export default new RoomService();
