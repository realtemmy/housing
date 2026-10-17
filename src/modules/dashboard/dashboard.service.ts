import { getPrismaClient } from "../../lib/db";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import {
  TenancyStatus,
  InventoryStatus,
  ListingStatus,
  VerificationStatus,
  PaymentVerificationStatus,
  ObligationStatus,
  ApplicationStatus,
  MaintenanceStatus,
  IssueStatus,
  ReservationStatus,
} from "../../generated/prisma/client";

export class DashboardService {
  // --- Tenant Dashboard ---
  static async getTenantDashboard(tenantId: string) {
    const prisma = await getPrismaClient();

    const [
      activeTenancy,
      pendingApplications,
      activeReservations,
      openMaintenance,
      openIssues,
      unreadNotificationsCount,
    ] = await Promise.all([
      prisma.tenancy.findFirst({
        where: { tenantId, status: TenancyStatus.ACTIVE },
        include: {
          property: { select: { id: true, title: true, addressStreet: true, area: true, city: true } },
          unit: { select: { id: true, unitNumber: true } },
          room: { select: { id: true, name: true } },
          bed: { select: { id: true, label: true } },
          obligations: {
            where: { status: { in: [ObligationStatus.PENDING, ObligationStatus.PARTIALLY_PAID, ObligationStatus.OVERDUE] } },
            orderBy: { dueDate: "asc" },
            take: 3,
          },
          paymentRecords: {
            where: { verificationStatus: PaymentVerificationStatus.REPORTED },
            take: 3,
          },
        },
      }),
      prisma.application.findMany({
        where: {
          applicantId: tenantId,
          status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED] },
        },
        include: {
          listing: { select: { id: true, headline: true, displayPrice: true, propertyId: true } },
        },
      }),
      prisma.reservation.findMany({
        where: {
          tenantId,
          status: ReservationStatus.ACTIVE_HOLD,
          expiresAt: { gt: new Date() },
        },
        include: {
          unit: true,
          room: true,
          bed: true,
        },
      }),
      prisma.maintenanceRequest.findMany({
        where: {
          requesterId: tenantId,
          status: { notIn: [MaintenanceStatus.COMPLETED, MaintenanceStatus.REJECTED] },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.tenantIssue.findMany({
        where: {
          reporterId: tenantId,
          status: { notIn: [IssueStatus.RESOLVED, IssueStatus.DISMISSED] },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.notification.count({
        where: { recipientId: tenantId, isRead: false },
      }),
    ]);

    return {
      activeTenancy,
      pendingApplications,
      activeReservations,
      openMaintenance,
      openIssues,
      unreadNotificationsCount,
    };
  }

  // --- Landlord / Agent Dashboard ---
  static async getOwnerDashboard(userId: string) {
    const prisma = await getPrismaClient();

    const propertyFilter = {
      OR: [
        { ownerId: userId },
        { agentAssignments: { some: { agentId: userId, isActive: true } } },
      ],
      isActive: true,
      deletedAt: null,
    };

    const managedProperties = await prisma.property.findMany({
      where: propertyFilter,
      select: { id: true },
    });
    const propertyIds = managedProperties.map((p) => p.id);

    const [
      totalProperties,
      totalUnits,
      occupiedUnits,
      activeTenanciesCount,
      pendingApplicationsCount,
      unverifiedPaymentsCount,
      openMaintenanceCount,
      obligations,
    ] = await Promise.all([
      prisma.property.count({ where: propertyFilter }),
      prisma.unit.count({ where: { propertyId: { in: propertyIds } } }),
      prisma.unit.count({ where: { propertyId: { in: propertyIds }, status: InventoryStatus.OCCUPIED } }),
      prisma.tenancy.count({
        where: { propertyId: { in: propertyIds }, status: TenancyStatus.ACTIVE },
      }),
      prisma.application.count({
        where: {
          listing: { propertyId: { in: propertyIds } },
          status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW] },
        },
      }),
      prisma.paymentRecord.count({
        where: {
          tenancy: { propertyId: { in: propertyIds } },
          verificationStatus: PaymentVerificationStatus.REPORTED,
        },
      }),
      prisma.maintenanceRequest.count({
        where: {
          propertyId: { in: propertyIds },
          status: { notIn: [MaintenanceStatus.COMPLETED, MaintenanceStatus.REJECTED] },
        },
      }),
      prisma.rentObligation.findMany({
        where: {
          tenancy: { propertyId: { in: propertyIds }, status: TenancyStatus.ACTIVE },
        },
        select: {
          amountDue: true,
          amountPaid: true,
          balanceRemaining: true,
        },
      }),
    ]);

    const totalRentExpected = obligations.reduce((sum, o) => sum + Number(o.amountDue), 0);
    const totalRentCollected = obligations.reduce((sum, o) => sum + Number(o.amountPaid), 0);
    const totalRentOutstanding = obligations.reduce((sum, o) => sum + Number(o.balanceRemaining), 0);
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      properties: {
        total: totalProperties,
        totalUnits,
        occupiedUnits,
        occupancyRate: `${occupancyRate}%`,
      },
      tenancies: {
        active: activeTenanciesCount,
      },
      financials: {
        totalRentExpected,
        totalRentCollected,
        totalRentOutstanding,
        currency: "NGN",
      },
      actionItems: {
        unverifiedPayments: unverifiedPaymentsCount,
        pendingApplications: pendingApplicationsCount,
        openMaintenance: openMaintenanceCount,
      },
    };
  }

  // --- Admin Dashboard ---
  static async getAdminDashboard() {
    const prisma = await getPrismaClient();

    const [
      totalUsers,
      usersByRole,
      totalProperties,
      propertiesByVerification,
      totalListings,
      listingsByStatus,
      activeTenancies,
      verifiedPaymentsSum,
      pendingVerificationCases,
      pendingSuspiciousReports,
      escalatedDisputes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.property.groupBy({
        by: ["verificationStatus"],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.listing.count(),
      prisma.listing.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.tenancy.count({ where: { status: TenancyStatus.ACTIVE } }),
      prisma.paymentRecord.aggregate({
        where: { verificationStatus: PaymentVerificationStatus.VERIFIED },
        _sum: { amount: true },
      }),
      prisma.verificationCase.count({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      }),
      prisma.suspiciousReport.count({
        where: { status: "PENDING" },
      }),
      prisma.tenantIssue.count({
        where: { status: IssueStatus.ESCALATED },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        byRole: usersByRole.reduce((acc: any, r) => {
          acc[r.role] = r._count.id;
          return acc;
        }, {}),
      },
      properties: {
        total: totalProperties,
        byVerification: propertiesByVerification.reduce((acc: any, p) => {
          acc[p.verificationStatus] = p._count.id;
          return acc;
        }, {}),
      },
      listings: {
        total: totalListings,
        byStatus: listingsByStatus.reduce((acc: any, l) => {
          acc[l.status] = l._count.id;
          return acc;
        }, {}),
      },
      tenancies: {
        active: activeTenancies,
      },
      transactions: {
        totalVerifiedAmount: Number(verifiedPaymentsSum._sum.amount || 0),
        currency: "NGN",
      },
      moderationQueue: {
        pendingPropertyVerifications: pendingVerificationCases,
        pendingSuspiciousReports,
        escalatedDisputes,
      },
    };
  }

  // --- Audit Trail ---
  static async listAuditLogs(params: {
    actorId?: string;
    entityType?: string;
    action?: string;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(params);

    const where: any = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.entityType) where.entityType = params.entityType;
    if (params.action) where.action = { contains: params.action, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          actor: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }
}
