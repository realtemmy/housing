import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { LeaseStatus, PaymentFrequency, RentableType } from "../generated/prisma/client";
import { Prisma } from "../generated/prisma/client";

export interface CreateLeaseInput {
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  rentAmount: number;
  securityDeposit?: number;
  serviceCharge?: number;
  paymentFrequency?: PaymentFrequency;
  actualMoveInDate?: Date | string;
  agreementUrl?: string | null;
}

export interface UpdateLeaseInput {
  rentAmount?: number;
  securityDeposit?: number;
  serviceCharge?: number;
  paymentFrequency?: PaymentFrequency;
  status?: LeaseStatus;
  actualMoveInDate?: Date | string | null;
  actualMoveOutDate?: Date | string | null;
  agreementUrl?: string | null;
  terminationReason?: string | null;
  terminationDate?: Date | string | null;
}

export interface GetLeasesOptions {
  page?: number;
  limit?: number;
  tenantId?: string;
  rentableId?: string;
  rentableType?: RentableType;
  status?: string;
  includeDeleted?: boolean;
}

export class LeaseService {
  async getAllLeases(options: GetLeasesOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      ...(options.tenantId && { tenantId: options.tenantId }),
      ...(options.rentableId && { rentableId: options.rentableId }),
      ...(options.rentableType && { rentableType: options.rentableType }),
      ...(options.status && { status: options.status as LeaseStatus }),
    };

    const [totalItems, leases] = await prisma.$transaction([
      prisma.lease.count({ where: whereClause }),
      prisma.lease.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          tenant: true,
          payments: true,
          renewals: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: leases,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getLeaseById(id: string) {
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        tenant: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
        renewals: {
          orderBy: { requestedAt: "desc" },
        },
      },
    });

    if (!lease) {
      throw new AppError("Lease not found", 404);
    }

    return lease;
  }

  async createLease(input: CreateLeaseInput) {
    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: input.tenantId },
    });

    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    // Calculate total amount
    const rentAmount = new Prisma.Decimal(input.rentAmount.toString());
    const securityDeposit = input.securityDeposit !== undefined
      ? new Prisma.Decimal(input.securityDeposit.toString())
      : new Prisma.Decimal("0");
    const serviceCharge = input.serviceCharge !== undefined
      ? new Prisma.Decimal(input.serviceCharge.toString())
      : new Prisma.Decimal("0");
    const totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);

    const lease = await prisma.lease.create({
      data: {
        rentableId: input.rentableId,
        rentableType: input.rentableType,
        tenantId: input.tenantId,
        rentAmount: rentAmount,
        securityDeposit: securityDeposit,
        serviceCharge: serviceCharge,
        totalAmount: totalAmount,
        paymentFrequency: input.paymentFrequency ?? "YEARLY",
        actualMoveInDate: input.actualMoveInDate
          ? typeof input.actualMoveInDate === "string"
            ? new Date(input.actualMoveInDate)
            : input.actualMoveInDate
          : undefined,
        agreementUrl: input.agreementUrl ?? null,
        initializedAt: null,
      },
      include: {
        tenant: true,
        payments: true,
        renewals: true,
      },
    });

    return lease;
  }

  async updateLease(id: string, input: UpdateLeaseInput) {
    const existingLease = await prisma.lease.findUnique({
      where: { id },
    });

    if (!existingLease) {
      throw new AppError("Lease not found", 404);
    }

    // Calculate total amount if financial fields are being updated
    let rentAmount = existingLease.rentAmount;
    let securityDeposit = existingLease.securityDeposit;
    let serviceCharge = existingLease.serviceCharge;
    let totalAmount = existingLease.totalAmount;

    if (input.rentAmount !== undefined) {
      rentAmount = new Prisma.Decimal(input.rentAmount.toString());
    }
    if (input.securityDeposit !== undefined) {
      securityDeposit = new Prisma.Decimal(input.securityDeposit.toString());
    }
    if (input.serviceCharge !== undefined) {
      serviceCharge = new Prisma.Decimal(input.serviceCharge.toString());
    }

    if (input.rentAmount !== undefined ||
        input.securityDeposit !== undefined ||
        input.serviceCharge !== undefined) {
      totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);
    }

    const lease = await prisma.lease.update({
      where: { id },
      data: {
        ...(input.rentAmount !== undefined && { rentAmount }),
        ...(input.securityDeposit !== undefined && { securityDeposit }),
        ...(input.serviceCharge !== undefined && { serviceCharge }),
        ...(input.paymentFrequency !== undefined && { paymentFrequency: input.paymentFrequency }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.actualMoveInDate !== undefined && {
          actualMoveInDate: input.actualMoveInDate === null
            ? null
            : typeof input.actualMoveInDate === "string"
              ? new Date(input.actualMoveInDate)
              : input.actualMoveInDate
        }),
        ...(input.actualMoveOutDate !== undefined && {
          actualMoveOutDate: input.actualMoveOutDate === null
            ? null
            : typeof input.actualMoveOutDate === "string"
              ? new Date(input.actualMoveOutDate)
              : input.actualMoveOutDate
        }),
        ...(input.agreementUrl !== undefined && { agreementUrl: input.agreementUrl }),
        ...(input.terminationReason !== undefined && { terminationReason: input.terminationReason }),
        ...(input.terminationDate !== undefined && {
          terminationDate: input.terminationDate === null
            ? null
            : typeof input.terminationDate === "string"
              ? new Date(input.terminationDate)
              : input.terminationDate
        }),
        ...(totalAmount !== undefined && { totalAmount }),
        updatedAt: new Date(),
      },
      include: {
        tenant: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
        renewals: {
          orderBy: { requestedAt: "desc" },
        },
      },
    });

    return lease;
  }

  // Note: We won't implement hard delete for leases as they are important for audit/history
  // Instead, we can mark them as CANCELLED or EXPIRED through status updates
}

export default new LeaseService();