"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class TenantService {
    async getAllTenants(options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        const [totalItems, tenants] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.tenant.count(),
            prisma_1.prisma.tenant.findMany({
                skip,
                take: limit,
                include: {
                    leases: {
                        include: {
                            payments: true,
                            renewals: true,
                        },
                    },
                },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: tenants,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getTenantById(id) {
        const tenant = await prisma_1.prisma.tenant.findUnique({
            where: { id },
            include: {
                leases: {
                    include: {
                        payments: true,
                        renewals: true,
                    },
                },
            },
        });
        if (!tenant) {
            throw new appError_1.default("Tenant not found", 404);
        }
        return tenant;
    }
    async getTenantByUserId(userId) {
        const tenant = await prisma_1.prisma.tenant.findUnique({
            where: { userId },
            include: {
                leases: {
                    include: {
                        payments: true,
                        renewals: true,
                    },
                },
            },
        });
        if (!tenant) {
            throw new appError_1.default("Tenant not found for user", 404);
        }
        return tenant;
    }
    async createTenant(input) {
        // Check if tenant already exists for this user
        const existingTenant = await prisma_1.prisma.tenant.findUnique({
            where: { userId: input.userId },
        });
        if (existingTenant) {
            throw new appError_1.default("Tenant already exists for this user", 400);
        }
        const tenant = await prisma_1.prisma.tenant.create({
            data: {
                userId: input.userId,
                emergencyContact: input.emergencyContact ?? null,
                metadata: input.metadata ?? null,
            },
            include: {
                leases: {
                    include: {
                        payments: true,
                        renewals: true,
                    },
                },
            },
        });
        return tenant;
    }
    async updateTenant(id, input) {
        const existingTenant = await prisma_1.prisma.tenant.findUnique({
            where: { id },
        });
        if (!existingTenant) {
            throw new appError_1.default("Tenant not found", 404);
        }
        const tenant = await prisma_1.prisma.tenant.update({
            where: { id },
            data: {
                ...(input.emergencyContact !== undefined && { emergencyContact: input.emergencyContact }),
                ...(input.metadata !== undefined && { metadata: input.metadata }),
            },
            include: {
                leases: {
                    include: {
                        payments: true,
                        renewals: true,
                    },
                },
            },
        });
        return tenant;
    }
    async deleteTenant(id) {
        const tenant = await prisma_1.prisma.tenant.findUnique({
            where: { id },
            include: {
                leases: true,
            },
        });
        if (!tenant) {
            throw new appError_1.default("Tenant not found", 404);
        }
        // Check if tenant has active leases
        const activeLeases = await prisma_1.prisma.lease.count({
            where: {
                tenantId: id,
                status: { in: ["PENDING", "ACTIVE"] },
            },
        });
        if (activeLeases > 0) {
            throw new appError_1.default("Cannot delete tenant with active leases", 400);
        }
        await prisma_1.prisma.tenant.delete({
            where: { id },
        });
        return { id };
    }
}
exports.TenantService = TenantService;
exports.default = new TenantService();
