import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import { IssueCategory, IssuePriority, IssueStatus } from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class IssueService {
  static async createIssue(reporterId: string, data: {
    propertyId: string;
    tenancyId?: string;
    title: string;
    description: string;
    category: IssueCategory;
    priority: IssuePriority;
    evidenceUrls?: string[];
  }) {
    const prisma = await getPrismaClient();

    return prisma.$transaction(async (tx) => {
      const issue = await tx.tenantIssue.create({
        data: {
          propertyId: data.propertyId,
          tenancyId: data.tenancyId,
          reporterId,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          evidenceUrls: data.evidenceUrls || [],
          status: IssueStatus.OPEN,
        },
      });

      await tx.tenantIssueAuditLog.create({
        data: {
          tenantIssueId: issue.id,
          action: "ISSUE_OPENED",
          performedById: reporterId,
          details: `Issue opened with priority ${data.priority}`,
        },
      });

      return issue;
    });
  }

  static async listIssues(userId: string, role: string, filters: {
    propertyId?: string;
    status?: IssueStatus;
    category?: IssueCategory;
    priority?: IssuePriority;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};
    if (role === "TENANT") {
      where.reporterId = userId;
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
    if (filters.priority) where.priority = filters.priority;

    const [items, total] = await Promise.all([
      prisma.tenantIssue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: { select: { id: true, title: true, area: true } },
          reporter: { select: { id: true, firstName: true, lastName: true, phone: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true, phone: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.tenantIssue.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getIssueById(issueId: string, userId: string, role: string) {
    const prisma = await getPrismaClient();

    const issue = await prisma.tenantIssue.findUnique({
      where: { id: issueId },
      include: {
        property: true,
        reporter: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        comments: { orderBy: { createdAt: "asc" } },
        auditLogs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!issue) throw new NotFoundError("TenantIssue", issueId);

    const isReporter = issue.reporterId === userId;
    const hasAccess = await verifyPropertyAccess(issue.propertyId, userId);
    if (!isReporter && !hasAccess) throw new ForbiddenError("Permission denied");

    // Mask private internal comments from tenant
    if (role === "TENANT") {
      issue.comments = issue.comments.filter((c) => !c.isPrivate);
    }

    return issue;
  }

  static async updateIssue(issueId: string, userId: string, role: string, data: {
    status: IssueStatus;
    assignedToId?: string;
    resolutionNotes?: string;
    note?: string;
  }) {
    const prisma = await getPrismaClient();

    const issue = await prisma.tenantIssue.findUnique({ where: { id: issueId } });
    if (!issue) throw new NotFoundError("TenantIssue", issueId);

    const hasAccess = await verifyPropertyAccess(issue.propertyId, userId);
    if (!hasAccess && role !== "ADMIN") throw new ForbiddenError("Permission denied");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.tenantIssue.update({
        where: { id: issueId },
        data: {
          status: data.status,
          assignedToId: data.assignedToId,
          resolutionNotes: data.resolutionNotes,
          resolvedById: data.status === IssueStatus.RESOLVED ? userId : undefined,
          resolvedAt: data.status === IssueStatus.RESOLVED ? new Date() : undefined,
        },
      });

      await tx.tenantIssueAuditLog.create({
        data: {
          tenantIssueId: issueId,
          action: `STATUS_CHANGE_TO_${data.status}`,
          performedById: userId,
          details: data.note || data.resolutionNotes,
        },
      });

      return updated;
    });
  }

  static async addComment(issueId: string, userId: string, role: string, data: {
    comment: string;
    isPrivate?: boolean;
  }) {
    const prisma = await getPrismaClient();

    const issue = await prisma.tenantIssue.findUnique({ where: { id: issueId } });
    if (!issue) throw new NotFoundError("TenantIssue", issueId);

    const isReporter = issue.reporterId === userId;
    const hasAccess = await verifyPropertyAccess(issue.propertyId, userId);
    if (!isReporter && !hasAccess && role !== "ADMIN") throw new ForbiddenError("Permission denied");

    const isPrivate = role === "TENANT" ? false : (data.isPrivate ?? false);

    return prisma.tenantIssueComment.create({
      data: {
        tenantIssueId: issueId,
        authorId: userId,
        comment: data.comment,
        isPrivate,
      },
    });
  }
}
