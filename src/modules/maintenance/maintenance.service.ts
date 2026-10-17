import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import {
  MaintenanceCategory,
  MaintenanceUrgency,
  MaintenanceStatus,
} from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class MaintenanceService {
  static async createRequest(requesterId: string, data: {
    propertyId: string;
    tenancyId?: string;
    title: string;
    description: string;
    category: MaintenanceCategory;
    urgency: MaintenanceUrgency;
    accessPreference?: string;
    attachmentUrls?: string[];
  }) {
    const prisma = await getPrismaClient();

    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.create({
        data: {
          propertyId: data.propertyId,
          tenancyId: data.tenancyId,
          requesterId,
          title: data.title,
          description: data.description,
          category: data.category,
          urgency: data.urgency,
          accessPreference: data.accessPreference,
          status: MaintenanceStatus.SUBMITTED,
        },
      });

      if (data.attachmentUrls && data.attachmentUrls.length > 0) {
        await tx.maintenanceAttachment.createMany({
          data: data.attachmentUrls.map((url) => ({
            maintenanceRequestId: request.id,
            url,
            uploadedById: requesterId,
          })),
        });
      }

      await tx.maintenanceStatusLog.create({
        data: {
          maintenanceRequestId: request.id,
          fromStatus: MaintenanceStatus.SUBMITTED,
          toStatus: MaintenanceStatus.SUBMITTED,
          changedById: requesterId,
          note: "Maintenance request opened",
        },
      });

      return request;
    });
  }

  static async listRequests(userId: string, role: string, filters: {
    propertyId?: string;
    status?: MaintenanceStatus;
    category?: MaintenanceCategory;
    urgency?: MaintenanceUrgency;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};
    if (role === "TENANT") {
      where.requesterId = userId;
    } else if (role !== "ADMIN") {
      where.property = {
        OR: [
          { ownerId: userId },
          { agentAssignments: { some: { agentId: userId, isActive: true } } },
        ],
      };
    }

    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.urgency) where.urgency = filters.urgency;

    const [items, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: { select: { id: true, title: true, area: true } },
          requester: { select: { id: true, firstName: true, lastName: true, phone: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true, phone: true } },
          _count: { select: { comments: true, attachments: true } },
        },
      }),
      prisma.maintenanceRequest.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getRequestById(requestId: string, userId: string, role: string) {
    const prisma = await getPrismaClient();

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      include: {
        property: true,
        requester: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        comments: {
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
        statusLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!request) throw new NotFoundError("MaintenanceRequest", requestId);

    const isRequester = request.requesterId === userId;
    const hasAccess = await verifyPropertyAccess(request.propertyId, userId);
    if (!isRequester && !hasAccess) throw new ForbiddenError("Permission denied");

    // Filter out internal comments if caller is the tenant
    if (role === "TENANT") {
      request.comments = request.comments.filter((c) => !c.isInternal);
    }

    return request;
  }

  static async updateStatus(requestId: string, userId: string, data: {
    status: MaintenanceStatus;
    assignedToId?: string;
    estimatedCost?: number;
    actualCost?: number;
    scheduledFor?: string;
    rejectionReason?: string;
    note?: string;
  }) {
    const prisma = await getPrismaClient();

    const request = await prisma.maintenanceRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError("MaintenanceRequest", requestId);

    const hasAccess = await verifyPropertyAccess(request.propertyId, userId, "canManageMaintenance");
    if (!hasAccess && request.assignedToId !== userId) throw new ForbiddenError("Permission denied");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          status: data.status,
          assignedToId: data.assignedToId,
          estimatedCost: data.estimatedCost,
          actualCost: data.actualCost,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
          rejectionReason: data.rejectionReason,
          completedAt: data.status === MaintenanceStatus.COMPLETED ? new Date() : undefined,
        },
      });

      await tx.maintenanceStatusLog.create({
        data: {
          maintenanceRequestId: requestId,
          fromStatus: request.status,
          toStatus: data.status,
          changedById: userId,
          note: data.note,
        },
      });

      return updated;
    });
  }

  static async addComment(requestId: string, userId: string, role: string, data: {
    message: string;
    isInternal?: boolean;
  }) {
    const prisma = await getPrismaClient();

    const request = await prisma.maintenanceRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError("MaintenanceRequest", requestId);

    const isRequester = request.requesterId === userId;
    const hasAccess = await verifyPropertyAccess(request.propertyId, userId);
    if (!isRequester && !hasAccess) throw new ForbiddenError("Permission denied");

    // Tenants cannot post internal notes
    const isInternal = role === "TENANT" ? false : (data.isInternal ?? false);

    return prisma.maintenanceComment.create({
      data: {
        maintenanceRequestId: requestId,
        authorId: userId,
        message: data.message,
        isInternal,
      },
    });
  }
}
