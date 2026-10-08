import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client";

export interface CreateLeasePaymentInput {
  leaseId: string;
  amount: number;
  reference: string;
  status?: string; // SUCCESS or FAILED
  currency?: string;
  paymentId?: string;
}

export interface UpdateLeasePaymentInput {
  amount?: number;
  reference?: string;
  status?: string; // SUCCESS or FAILED
  currency?: string;
  paymentId?: string;
  paidAt?: Date | string | null;
}

export interface GetLeasePaymentsOptions {
  page?: number;
  limit?: number;
  leaseId?: string;
  status?: string;
}

export class LeasePaymentService {
  async getAllLeasePayments(options: GetLeasePaymentsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      ...(options.leaseId && { leaseId: options.leaseId }),
      ...(options.status && { status: options.status }),
    };

    const [totalItems, payments] = await prisma.$transaction([
      prisma.leasePayment.count({ where: whereClause }),
      prisma.leasePayment.findMany({
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
        orderBy: { paidAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: payments,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getLeasePaymentById(id: string) {
    const payment = await prisma.leasePayment.findUnique({
      where: { id },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError("Lease payment not found", 404);
    }

    return payment;
  }

  async createLeasePayment(input: CreateLeasePaymentInput) {
    // Verify lease exists
    const lease = await prisma.lease.findUnique({
      where: { id: input.leaseId },
    });

    if (!lease) {
      throw new AppError("Lease not found", 404);
    }

    const payment = await prisma.leasePayment.create({
      data: {
        leaseId: input.leaseId,
        amount: new Prisma.Decimal(input.amount.toString()),
        reference: input.reference,
        status: input.status ?? "SUCCESS",
        currency: input.currency ?? "NGN",
        paymentId: input.paymentId ?? null,
        paidAt: new Date(),
      },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return payment;
  }

  async updateLeasePayment(id: string, input: UpdateLeasePaymentInput) {
    const existingPayment = await prisma.leasePayment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      throw new AppError("Lease payment not found", 404);
    }

    const payment = await prisma.leasePayment.update({
      where: { id },
      data: {
        ...(input.amount !== undefined && { amount: new Prisma.Decimal(input.amount.toString()) }),
        ...(input.reference !== undefined && { reference: input.reference }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.paymentId !== undefined && { paymentId: input.paymentId }),
        ...(input.paidAt !== undefined && {
          paidAt: input.paidAt === null
            ? null
            : typeof input.paidAt === "string"
              ? new Date(input.paidAt)
              : input.paidAt
        }),
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

    return payment;
  }

  async deleteLeasePayment(id: string) {
    const payment = await prisma.leasePayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new AppError("Lease payment not found", 404);
    }

    await prisma.leasePayment.delete({
      where: { id },
    });

    return { id };
  }
}

export default new LeasePaymentService();