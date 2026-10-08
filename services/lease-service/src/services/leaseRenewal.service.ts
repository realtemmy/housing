import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client";

export interface CreateLeaseRenewalInput {
  leaseId: string;
  newStart: Date | string;
  newEnd: Date | string;
  newRent?: number;
  approved?: boolean;
  notes?: string | null;
}

export interface UpdateLeaseRenewalInput {
  newStart?: Date | string | null;
  newEnd?: Date | string | null;
  newRent?: number;
  approved?: boolean;
  notes?: string | null;
}

export interface GetLeaseRenewalsOptions {
  page?: number;
  limit?: number;
  leaseId?: string;
  approved?: boolean;
}

export class LeaseRenewalService {
  async getAllLeaseRenewals(options: GetLeaseRenewalsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      ...(options.leaseId && { leaseId: options.leaseId }),
      ...(options.approved !== undefined && { approved: options.approved }),
    };

    const [totalItems, renewals] = await prisma.$transaction([
      prisma.leaseRenewal.count({ where: whereClause }),
      prisma.leaseRenewal.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          lease: {
            include: {
              tenant: true,
            },
          },
        },
        orderBy: { requestedAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: renewals,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getLeaseRenewalById(id: string) {
    const renewal = await prisma.leaseRenewal.findUnique({
      where: { id },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!renewal) {
      throw new AppError("Lease renewal not found", 404);
    }

    return renewal;
  }

  async createLeaseRenewal(input: CreateLeaseRenewalInput) {
    // Verify lease exists
    const lease = await prisma.lease.findUnique({
      where: { id: input.leaseId },
    });

    if (!lease) {
      throw new AppError("Lease not found", 404);
    }

    const renewal = await prisma.leaseRenewal.create({
      data: {
        leaseId: input.leaseId,
        newStart: input.newStart instanceof Date ? input.newStart : new Date(input.newStart),
        newEnd: input.newEnd instanceof Date ? input.newEnd : new Date(input.newEnd),
        newRent: input.newRent !== undefined
          ? new Prisma.Decimal(input.newRent.toString())
          : undefined,
        approved: input.approved ?? true,
        notes: input.notes ?? null,
      },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return renewal;
  }

  async updateLeaseRenewal(id: string, input: UpdateLeaseRenewalInput) {
    const existingRenewal = await prisma.leaseRenewal.findUnique({
      where: { id },
    });

    if (!existingRenewal) {
      throw new AppError("Lease renewal not found", 404);
    }

    const renewal = await prisma.leaseRenewal.update({
      where: { id },
      data: {
        ...(input.newStart !== undefined && {
          newStart: input.newStart === null
            ? null
            : input.newStart instanceof Date
              ? input.newStart
              : new Date(input.newStart)
        }),
        ...(input.newEnd !== undefined && {
          newEnd: input.newEnd === null
            ? null
            : input.newEnd instanceof Date
              ? input.newEnd
              : new Date(input.newEnd)
        }),
        ...(input.newRent !== undefined && {
          newRent: input.newRent === null
            ? null
            : new Prisma.Decimal(input.newRent.toString())
        }),
        ...(input.approved !== undefined && { approved: input.approved }),
        ...(input.notes !== undefined && { notes: input.notes }),
        updatedAt: new Date(),
      },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return renewal;
  }

  async deleteLeaseRenewal(id: string) {
    const renewal = await prisma.leaseRenewal.findUnique({
      where: { id },
    });

    if (!renewal) {
      throw new AppError("Lease renewal not found", 404);
    }

    await prisma.leaseRenewal.delete({
      where: { id },
    });

    return { id };
  }
}

export default new LeaseRenewalService();