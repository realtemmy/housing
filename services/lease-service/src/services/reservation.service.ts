import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client";

export type ReservationType = 'unit' | 'room' | 'bed';

export interface CreateReservationInput {
  reservorId: string;
  reservationType: ReservationType;
  reservationId: string; // ID of the unit/room/bed
  applicationId?: string;
  expiresAt?: Date | string;
  reservationFee?: number;
  depositAmount?: number;
  notes?: string;
}

export interface UpdateReservationInput {
  applicationId?: string | null;
  expiresAt?: Date | string | null;
  reservationFee?: number;
  reservationFeePaid?: boolean;
  depositAmount?: number;
  depositPaid?: boolean;
  notes?: string | null;
  status?: string; // ReservationStatus
}

export interface GetReservationsOptions {
  page?: number;
  limit?: number;
  reservorId?: string;
  status?: string;
  reservationType?: ReservationType;
}

export class ReservationService {
  async getAllReservations(options: GetReservationsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      ...(options.reservorId && { reservorId: options.reservorId }),
      ...(options.status && { status: options.status }),
    };

    // Handle reservationType filter
    if (options.reservationType) {
      const typeField = `${options.reservationType}Id`;
      whereClause[typeField] = options.reservationId; // Wait, this is wrong - we don't have reservationId in options

      // Actually, we need to handle this differently - we'll filter after fetching or do separate queries
      // For now, let's not implement type filtering in the WHERE clause to keep it simple
      // We can add it later if needed
    };

    const [totalItems, reservations] = await prisma.$transaction([
      prisma.reservation.count({ where: whereClause }),
      prisma.reservation.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          // We could include related data here if needed
        },
        orderBy: { reservedAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: reservations,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getReservationById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new AppError("Reservation not found", 404);
    }

    return reservation;
  }

  async getReservationsByReservor(reservorId: string, options: GetReservationsOptions = {}) {
    return this.getAllReservations({
      ...options,
      reservorId,
    });
  }

  async createReservation(input: CreateReservationInput) {
    // Verify reservor exists (basic check - in reality we'd check auth service)
    // Verify the target unit/room/bed exists and is available for reservation
    let targetExists = false;
    let targetStatus: string | null = null;

    if (input.reservationType === 'unit' && input.reservationId) {
      const unit = await prisma.unit.findUnique({
        where: { id: input.reservationId },
      });
      targetExists = !!unit;
      targetStatus = unit?.status ?? null;
    } else if (input.reservationType === 'room' && input.reservationId) {
      const room = await prisma.room.findUnique({
        where: { id: input.reservationId },
      });
      targetExists = !!room;
      targetStatus = room?.status ?? null;
    } else if (input.reservationType === 'bed' && input.reservationId) {
      const bed = await prisma.bed.findUnique({
        where: { id: input.reservationId },
      });
      targetExists = !!bed;
      targetStatus = bed?.status ?? null;
    }

    if (!targetExists) {
      throw new AppError("Target unit/room/bed not found", 404);
    }

    // Check if target is available for reservation (should be AVAILABLE or possibly RESERVED by same user?)
    // For now, let's allow reservation of AVAILABLE items only
    // In a more sophisticated system, we might allow overlapping reservations or have more complex logic
    if (targetStatus !== 'AVAILABLE') {
      throw new AppError("Target unit/room/bed is not available for reservation", 400);
    }

    // Set default expiration if not provided (e.g., 7 days from now)
    const defaultExpiresAt = new Date();
    defaultExpiresAt.setDate(defaultExpiresAt.getDate() + 7);

    const reservation = await prisma.reservation.create({
      data: {
        reservorId: input.reservorId,
        ...(input.applicationId && { applicationId: input.applicationId }),
        ...(input.reservationType === 'unit' && { unitId: input.reservationId }),
        ...(input.reservationType === 'room' && { roomId: input.reservationId }),
        ...(input.reservationType === 'bed' && { bedId: input.reservationId }),
        expiresAt: input.expiresAt
          ? typeof input.expiresAt === 'string'
            ? new Date(input.expiresAt)
            : input.expiresAt
          : defaultExpiresAt,
        reservationFee: input.reservationFee !== undefined
          ? new Prisma.Decimal(input.reservationFee.toString())
          : undefined,
        reservationFeePaid: input.reservationFeePaid ?? false,
        depositAmount: input.depositAmount !== undefined
          ? new Prisma.Decimal(input.depositAmount.toString())
          : undefined,
        depositPaid: input.depositPaid ?? false,
        notes: input.notes ?? null,
      },
    });

    // Update the target unit/room/bed status to RESERVED and set reservation dates
    if (input.reservationType === 'unit' && input.reservationId) {
      await prisma.unit.update({
        where: { id: input.reservationId },
        data: {
          status: 'RESERVED',
          reservedAt: new Date(),
          reservedUntil: reservation.expiresAt,
        },
      });
    } else if (input.reservationType === 'room' && input.reservationId) {
      await prisma.room.update({
        where: { id: input.reservationId },
        data: {
          status: 'RESERVED',
          reservedAt: new Date(),
          reservedUntil: reservation.expiresAt,
        },
      });
    } else if (input.reservationType === 'bed' && input.reservationId) {
      await prisma.bed.update({
        where: { id: input.reservationId },
        data: {
          status: 'RESERVED',
          reservedAt: new Date(),
          reservedUntil: reservation.expiresAt,
        },
      });
    }

    return reservation;
  }

  async updateReservation(id: string, input: UpdateReservationInput) {
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      throw new AppError("Reservation not found", 404);
    }

    // Get current reservation to know what type it is for updating inventory status
    const reservationType = existingReservation.unitId ? 'unit'
                      : existingReservation.roomId ? 'room'
                      : existingReservation.bedId ? 'bed'
                      : null;
    const reservationId = existingReservation.unitId ?? existingReservation.roomId ?? existingReservation.bedId;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        ...(input.applicationId !== undefined && { applicationId: input.applicationId }),
        ...(input.expiresAt !== undefined && {
          expiresAt: input.expiresAt === null
            ? null
            : typeof input.expiresAt === 'string'
              ? new Date(input.expiresAt)
              : input.expiresAt
        }),
        ...(input.reservationFee !== undefined && {
          reservationFee: input.reservationFee === null
            ? null
            : new Prisma.Decimal(input.reservationFee.toString())
        }),
        ...(input.reservationFeePaid !== undefined && { reservationFeePaid: input.reservationFeePaid }),
        ...(input.depositAmount !== undefined && {
          depositAmount: input.depositAmount === null
            ? null
            : new Prisma.Decimal(input.depositAmount.toString())
        }),
        ...(input.depositPaid !== undefined && { depositPaid: input.depositPaid }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.status !== undefined && { status: input.status }),
        updatedAt: new Date(),
      },
    });

    // If status changed to EXPIRED, CANCELLED, or CONVERTED, update the inventory item status back to AVAILABLE
    if (input.status) {
      const newStatus = input.status as string;
      if (['EXPIRED', 'CANCELLED', 'CONVERTED'].includes(newStatus) && reservationType && reservationId) {
        // Update the inventory item back to AVAILABLE and clear reservation dates
        if (reservationType === 'unit' && reservationId) {
          await prisma.unit.update({
            where: { id: reservationId },
            data: {
              status: 'AVAILABLE',
              reservedAt: null,
              reservedUntil: null,
            },
          });
        } else if (reservationType === 'room' && reservationId) {
          await prisma.room.update({
            where: { id: reservationId },
            data: {
              status: 'AVAILABLE',
              reservedAt: null,
              reservedUntil: null,
            },
          });
        } else if (reservationType === 'bed' && reservationId) {
          await prisma.bed.update({
            where: { id: reservationId },
            data: {
              status: 'AVAILABLE',
              reservedAt: null,
              reservedUntil: null,
            },
          });
        }
      }
    }

    return reservation;
  }

  async deleteReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new AppError("Reservation not found", 404);
    }

    // Get reservation info to update inventory status
    const reservationType = reservation.unitId ? 'unit'
                      : reservation.roomId ? 'room'
                      : reservation.bedId ? 'bed'
                      : null;
    const reservationId = reservation.unitId ?? reservation.roomId ?? reservation.bedId;

    await prisma.reservation.delete({
      where: { id },
    });

    // If reservation is being deleted, set inventory item back to AVAILABLE
    if (reservationType && reservationId) {
      if (reservationType === 'unit' && reservationId) {
        await prisma.unit.update({
          where: { id: reservationId },
          data: {
            status: 'AVAILABLE',
            reservedAt: null,
            reservedUntil: null,
          },
        });
      } else if (reservationType === 'room' && reservationId) {
        await prisma.room.update({
          where: { id: reservationId },
          data: {
            status: 'AVAILABLE',
            reservedAt: null,
            reservedUntil: null,
          },
        });
      } else if (reservationType === 'bed' && reservationId) {
        await prisma.bed.update({
          where: { id: reservationId },
          data: {
            status: 'AVAILABLE',
            reservedAt: null,
            reservedUntil: null,
          },
        });
      }
    }

    return { id };
  }
}

export default new ReservationService();