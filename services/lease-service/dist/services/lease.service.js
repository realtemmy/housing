"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaseService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class LeaseService {
    async getAllLeases(options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // Build where clause
        const whereClause = {
            ...(options.tenantId && { tenantId: options.tenantId }),
            ...(options.rentableId && { rentableId: options.rentableId }),
            ...(options.rentableType && { rentableType: options.rentableType }),
            ...(options.status && { status: options.status }),
        };
        const [totalItems, leases] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.lease.count({ where: whereClause }),
            prisma_1.prisma.lease.findMany({
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
    async getLeaseById(id) {
        const lease = await prisma_1.prisma.lease.findUnique({
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
            throw new appError_1.default("Lease not found", 404);
        }
        return lease;
    }
    async createLease(input) {
        // Verify tenant exists
        const tenant = await prisma_1.prisma.tenant.findUnique({
            where: { id: input.tenantId },
        });
        if (!tenant) {
            throw new appError_1.default("Tenant not found", 404);
        }
        // Calculate total amount
        const rentAmount = new client_1.Prisma.Decimal(input.rentAmount.toString());
        const securityDeposit = input.securityDeposit !== undefined
            ? new client_1.Prisma.Decimal(input.securityDeposit.toString())
            : new client_1.Prisma.Decimal("0");
        const serviceCharge = input.serviceCharge !== undefined
            ? new client_1.Prisma.Decimal(input.serviceCharge.toString())
            : new client_1.Prisma.Decimal("0");
        const totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);
        const lease = await prisma_1.prisma.lease.create({
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
    async updateLease(id, input) {
        const existingLease = await prisma_1.prisma.lease.findUnique({
            where: { id },
        });
        if (!existingLease) {
            throw new appError_1.default("Lease not found", 404);
        }
        // Calculate total amount if financial fields are being updated
        let rentAmount = existingLease.rentAmount;
        let securityDeposit = existingLease.securityDeposit;
        let serviceCharge = existingLease.serviceCharge;
        let totalAmount = existingLease.totalAmount;
        if (input.rentAmount !== undefined) {
            rentAmount = new client_1.Prisma.Decimal(input.rentAmount.toString());
        }
        if (input.securityDeposit !== undefined) {
            securityDeposit = new client_1.Prisma.Decimal(input.securityDeposit.toString());
        }
        if (input.serviceCharge !== undefined) {
            serviceCharge = new client_1.Prisma.Decimal(input.serviceCharge.toString());
        }
        if (input.rentAmount !== undefined ||
            input.securityDeposit !== undefined ||
            input.serviceCharge !== undefined) {
            totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);
        }
        const lease = await prisma_1.prisma.lease.update({
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
}
exports.LeaseService = LeaseService;
exports.default = new LeaseService();
