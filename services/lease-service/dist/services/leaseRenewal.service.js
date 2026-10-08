"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaseRenewalService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class LeaseRenewalService {
    async getAllLeaseRenewals(options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // Build where clause
        const whereClause = {
            ...(options.leaseId && { leaseId: options.leaseId }),
            ...(options.approved !== undefined && { approved: options.approved }),
        };
        const [totalItems, renewals] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.leaseRenewal.count({ where: whereClause }),
            prisma_1.prisma.leaseRenewal.findMany({
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
    async getLeaseRenewalById(id) {
        const renewal = await prisma_1.prisma.leaseRenewal.findUnique({
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
            throw new appError_1.default("Lease renewal not found", 404);
        }
        return renewal;
    }
    async createLeaseRenewal(input) {
        // Verify lease exists
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: input.leaseId },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        const renewal = await prisma_1.prisma.leaseRenewal.create({
            data: {
                leaseId: input.leaseId,
                newStart: input.newStart instanceof Date ? input.newStart : new Date(input.newStart),
                newEnd: input.newEnd instanceof Date ? input.newEnd : new Date(input.newEnd),
                newRent: input.newRent !== undefined
                    ? new client_1.Prisma.Decimal(input.newRent.toString())
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
    async updateLeaseRenewal(id, input) {
        const existingRenewal = await prisma_1.prisma.leaseRenewal.findUnique({
            where: { id },
        });
        if (!existingRenewal) {
            throw new appError_1.default("Lease renewal not found", 404);
        }
        const renewal = await prisma_1.prisma.leaseRenewal.update({
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
                        : new client_1.Prisma.Decimal(input.newRent.toString())
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
    async deleteLeaseRenewal(id) {
        const renewal = await prisma_1.prisma.leaseRenewal.findUnique({
            where: { id },
        });
        if (!renewal) {
            throw new appError_1.default("Lease renewal not found", 404);
        }
        await prisma_1.prisma.leaseRenewal.delete({
            where: { id },
        });
        return { id };
    }
}
exports.LeaseRenewalService = LeaseRenewalService;
exports.default = new LeaseRenewalService();
