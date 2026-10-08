"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeasePaymentService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class LeasePaymentService {
    getAllLeasePayments(options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // Build where clause
        const whereClause = {
            ...(options.leaseId && { leaseId: options.leaseId }),
            ...(options.status && { status: options.status }),
        };
        const [totalItems, payments] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.leasePayment.count({ where: whereClause }),
            prisma_1.prisma.leasePayment.findMany({
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
    async getLeasePaymentById(id) {
        const payment = await prisma_1.prisma.leasePayment.findUnique({
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
            throw new appError_1.default("Lease payment not found", 404);
        }
        return payment;
    }
    async createLeasePayment(input) {
        // Verify lease exists
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: input.leaseId },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        const payment = await prisma_1.prisma.leasePayment.create({
            data: {
                leaseId: input.leaseId,
                amount: new client_1.Prisma.Decimal(input.amount.toString()),
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
    async updateLeasePayment(id, input) {
        const existingPayment = await prisma_1.prisma.leasePayment.findUnique({
            where: { id },
        });
        if (!existingPayment) {
            throw new appError_1.default("Lease payment not found", 404);
        }
        const payment = await prisma_1.prisma.leasePayment.update({
            where: { id },
            data: {
                ...(input.amount !== undefined && { amount: new client_1.Prisma.Decimal(input.amount.toString()) }),
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
    async deleteLeasePayment(id) {
        const payment = await prisma_1.prisma.leasePayment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new appError_1.default("Lease payment not found", 404);
        }
        await prisma_1.prisma.leasePayment.delete({
            where: { id },
        });
        return { id };
    }
}
exports.LeasePaymentService = LeasePaymentService;
exports.default = new LeasePaymentService();
