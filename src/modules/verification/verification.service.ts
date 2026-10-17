import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError, ConflictError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import { VerificationCaseCategory, VerificationCaseStatus, VerificationStatus, ListingStatus } from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class VerificationService {
  static async submitCase(userId: string, data: {
    propertyId: string;
    category?: VerificationCaseCategory;
    evidenceUrls: string[];
    meterNumber?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    ownershipDocUrl?: string;
  }) {
    const prisma = await getPrismaClient();

    const hasAccess = await verifyPropertyAccess(data.propertyId, userId);
    if (!hasAccess) {
      throw new ForbiddenError("You can only submit verification for properties you manage or own");
    }

    // Check for active open case
    const existingOpenCase = await prisma.verificationCase.findFirst({
      where: {
        propertyId: data.propertyId,
        status: { in: [VerificationCaseStatus.SUBMITTED, VerificationCaseStatus.UNDER_REVIEW] },
      },
    });

    if (existingOpenCase) {
      throw new ConflictError("A verification case is already under review for this property");
    }

    // Create case and update property verification status
    const [verificationCase] = await prisma.$transaction([
      prisma.verificationCase.create({
        data: {
          propertyId: data.propertyId,
          submittedById: userId,
          category: data.category || VerificationCaseCategory.COMBINED,
          evidenceUrls: data.evidenceUrls,
          meterNumber: data.meterNumber,
          gpsLatitude: data.gpsLatitude,
          gpsLongitude: data.gpsLongitude,
          ownershipDocUrl: data.ownershipDocUrl,
          status: VerificationCaseStatus.SUBMITTED,
        },
      }),
      prisma.property.update({
        where: { id: data.propertyId },
        data: { verificationStatus: VerificationStatus.SUBMITTED },
      }),
    ]);

    return verificationCase;
  }

  static async listCases(params: { status?: VerificationCaseStatus; page?: number; limit?: number }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(params);

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [items, total] = await Promise.all([
      prisma.verificationCase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              area: true,
              city: true,
              ownerId: true,
              owner: {
                select: { id: true, firstName: true, lastName: true, email: true, phone: true },
              },
            },
          },
        },
      }),
      prisma.verificationCase.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getCaseById(caseId: string) {
    const prisma = await getPrismaClient();
    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: {
        property: {
          include: {
            owner: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
            media: true,
          },
        },
      },
    });

    if (!verificationCase) {
      throw new NotFoundError("VerificationCase", caseId);
    }

    return verificationCase;
  }

  static async reviewCase(caseId: string, adminId: string, data: {
    status: VerificationCaseStatus;
    decisionNotes?: string;
    rejectionReason?: string;
  }) {
    const prisma = await getPrismaClient();

    const verificationCase = await prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: { property: true },
    });

    if (!verificationCase) {
      throw new NotFoundError("VerificationCase", caseId);
    }

    // Anti-self-verification rule
    if (verificationCase.submittedById === adminId || verificationCase.property.ownerId === adminId) {
      throw new ForbiddenError("Administrators cannot review or verify their own properties");
    }

    let targetPropStatus: VerificationStatus = verificationCase.property.verificationStatus;
    if (data.status === VerificationCaseStatus.APPROVED) {
      targetPropStatus = VerificationStatus.VERIFIED;
    } else if (data.status === VerificationCaseStatus.REJECTED) {
      targetPropStatus = VerificationStatus.REJECTED;
    } else if (data.status === VerificationCaseStatus.UNDER_REVIEW) {
      targetPropStatus = VerificationStatus.UNDER_REVIEW;
    }

    const [updatedCase] = await prisma.$transaction([
      prisma.verificationCase.update({
        where: { id: caseId },
        data: {
          status: data.status,
          decisionNotes: data.decisionNotes,
          rejectionReason: data.rejectionReason,
          reviewedById: adminId,
          verifiedAt: data.status === VerificationCaseStatus.APPROVED ? new Date() : undefined,
        },
      }),
      prisma.property.update({
        where: { id: verificationCase.propertyId },
        data: { verificationStatus: targetPropStatus },
      }),
      prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: `VERIFICATION_${data.status}`,
          entityType: "Property",
          entityId: verificationCase.propertyId,
          detailsJson: { caseId, notes: data.decisionNotes, rejectionReason: data.rejectionReason },
        },
      }),
    ]);

    return updatedCase;
  }

  // --- Suspicious Reports ---
  static async reportSuspiciousListing(data: {
    listingId: string;
    reporterId?: string;
    reason: string;
    details?: string;
  }) {
    const prisma = await getPrismaClient();

    const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
    if (!listing) throw new NotFoundError("Listing", data.listingId);

    return prisma.suspiciousReport.create({
      data: {
        listingId: data.listingId,
        reporterId: data.reporterId,
        reason: data.reason,
        details: data.details,
        status: "PENDING",
      },
    });
  }

  static async listSuspiciousReports(page = 1, limit = 20) {
    const prisma = await getPrismaClient();
    const { skip } = parsePagination({ page, limit });

    const [items, total] = await Promise.all([
      prisma.suspiciousReport.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          listing: {
            select: { id: true, headline: true, status: true, propertyId: true },
          },
        },
      }),
      prisma.suspiciousReport.count(),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async reviewSuspiciousReport(reportId: string, adminId: string, data: {
    status: string;
    adminNotes?: string;
    delistListing?: boolean;
  }) {
    const prisma = await getPrismaClient();
    const report = await prisma.suspiciousReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundError("SuspiciousReport", reportId);

    const ops: any[] = [
      prisma.suspiciousReport.update({
        where: { id: reportId },
        data: {
          status: data.status,
          adminNotes: data.adminNotes,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: "REVIEW_SUSPICIOUS_REPORT",
          entityType: "Listing",
          entityId: report.listingId,
          detailsJson: { reportId, status: data.status, delistListing: data.delistListing },
        },
      }),
    ];

    if (data.delistListing) {
      ops.push(
        prisma.listing.update({
          where: { id: report.listingId },
          data: { status: ListingStatus.DELISTED },
        })
      );
    }

    const [updatedReport] = await prisma.$transaction(ops);
    return updatedReport;
  }
}
