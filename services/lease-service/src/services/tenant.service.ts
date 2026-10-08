import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client";

export interface CreateTenantInput {
  userId: string;
  emergencyContact?: string | null;
  metadata?: object | null;
}

export interface UpdateTenantInput {
  emergencyContact?: string | null;
  metadata?: object | null;
}

export interface GetTenantsOptions {
  page?: number;
  limit?: number;
}

export class TenantService {
  async getAllTenants(options: GetTenantsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    const [totalItems, tenants] = await prisma.$transaction([
      prisma.tenant.count(),
      prisma.tenant.findMany({
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

  async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
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
      throw new AppError("Tenant not found", 404);
    }

    return tenant;
  }

  async getTenantByUserId(userId: string) {
    const tenant = await prisma.tenant.findUnique({
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
      throw new AppError("Tenant not found for user", 404);
    }

    return tenant;
  }

  async createTenant(input: CreateTenantInput) {
    // Check if tenant already exists for this user
    const existingTenant = await prisma.tenant.findUnique({
      where: { userId: input.userId },
    });

    if (existingTenant) {
      throw new AppError("Tenant already exists for this user", 400);
    }

    const tenant = await prisma.tenant.create({
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

  async updateTenant(id: string, input: UpdateTenantInput) {
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      throw new AppError("Tenant not found", 404);
    }

    const tenant = await prisma.tenant.update({
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

  async deleteTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        leases: true,
      },
    });

    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    // Check if tenant has active leases
    const activeLeases = await prisma.lease.count({
      where: {
        tenantId: id,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });

    if (activeLeases > 0) {
      throw new AppError("Cannot delete tenant with active leases", 400);
    }

    await prisma.tenant.delete({
      where: { id },
    });

    return { id };
  }
}

export default new TenantService();