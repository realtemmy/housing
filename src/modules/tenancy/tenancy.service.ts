import crypto from "crypto";
import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import {
  TenancyStatus,
  AgreementStatus,
  InventoryStatus,
  ReservationStatus,
  ObligationType,
  ObligationStatus,
  BillingFrequency,
} from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class TenancyService {
  static async createTenancy(creatorId: string, data: {
    propertyId: string;
    unitId?: string;
    roomId?: string;
    bedId?: string;
    tenantId: string;
    applicationId?: string;
    reservationId?: string;
    startDate: string;
    endDate: string;
    propertyReadyDate?: string;
    commencementDate?: string;
    rentAmount: number;
    cautionDeposit: number;
    serviceCharge?: number;
    billingFrequency: BillingFrequency;
    rentDueDay?: number;
    gracePeriodDays?: number;
    lateFeeAmount?: number;
  }) {
    const prisma = await getPrismaClient();

    const hasAccess = await verifyPropertyAccess(data.propertyId, creatorId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    // Fetch property owner
    const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!property) throw new NotFoundError("Property", data.propertyId);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    return prisma.$transaction(async (tx) => {
      // 1. Create Tenancy
      const tenancy = await tx.tenancy.create({
        data: {
          propertyId: data.propertyId,
          unitId: data.unitId,
          roomId: data.roomId,
          bedId: data.bedId,
          tenantId: data.tenantId,
          landlordId: property.ownerId,
          applicationId: data.applicationId,
          reservationId: data.reservationId,
          startDate,
          endDate,
          propertyReadyDate: data.propertyReadyDate ? new Date(data.propertyReadyDate) : undefined,
          commencementDate: data.commencementDate ? new Date(data.commencementDate) : undefined,
          rentAmount: data.rentAmount,
          cautionDeposit: data.cautionDeposit,
          serviceCharge: data.serviceCharge || 0,
          billingFrequency: data.billingFrequency,
          rentDueDay: data.rentDueDay,
          gracePeriodDays: data.gracePeriodDays ?? 5,
          lateFeeAmount: data.lateFeeAmount || 0,
          status: TenancyStatus.PENDING,
        },
      });

      // 2. Mark reservation CONFIRMED if present
      if (data.reservationId) {
        await tx.reservation.update({
          where: { id: data.reservationId },
          data: { status: ReservationStatus.CONFIRMED },
        });
      }

      // 3. Generate initial RentObligations for Rent and Caution Deposit
      await tx.rentObligation.createMany({
        data: [
          {
            tenancyId: tenancy.id,
            obligationType: ObligationType.RENT,
            description: "Initial Term Rent",
            periodStart: startDate,
            periodEnd: endDate,
            amountDue: data.rentAmount,
            amountPaid: 0,
            balanceRemaining: data.rentAmount,
            dueDate: startDate,
            status: ObligationStatus.PENDING,
          },
          ...(data.cautionDeposit > 0
            ? [
                {
                  tenancyId: tenancy.id,
                  obligationType: ObligationType.CAUTION_DEPOSIT,
                  description: "Security/Caution Deposit",
                  periodStart: startDate,
                  periodEnd: endDate,
                  amountDue: data.cautionDeposit,
                  amountPaid: 0,
                  balanceRemaining: data.cautionDeposit,
                  dueDate: startDate,
                  status: ObligationStatus.PENDING,
                },
              ]
            : []),
          ...(data.serviceCharge && data.serviceCharge > 0
            ? [
                {
                  tenancyId: tenancy.id,
                  obligationType: ObligationType.SERVICE_CHARGE,
                  description: "Initial Service Charge",
                  periodStart: startDate,
                  periodEnd: endDate,
                  amountDue: data.serviceCharge,
                  amountPaid: 0,
                  balanceRemaining: data.serviceCharge,
                  dueDate: startDate,
                  status: ObligationStatus.PENDING,
                },
              ]
            : []),
        ],
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: creatorId,
          action: "TENANCY_CREATED",
          entityType: "Tenancy",
          entityId: tenancy.id,
          detailsJson: {
            tenantId: data.tenantId,
            propertyId: data.propertyId,
            rentAmount: data.rentAmount,
          },
        },
      });

      return tenancy;
    });
  }

  static async listTenancies(userId: string, role: string, filters: {
    propertyId?: string;
    status?: TenancyStatus;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};
    if (role === "TENANT") {
      where.tenantId = userId;
    } else {
      where.property = {
        OR: [
          { ownerId: userId },
          { agentAssignments: { some: { agentId: userId, isActive: true } } },
        ],
      };
    }

    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.status) where.status = filters.status;

    const [items, total] = await Promise.all([
      prisma.tenancy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: { id: true, title: true, area: true, city: true },
          },
          unit: { select: { id: true, unitNumber: true } },
          room: { select: { id: true, name: true } },
          bed: { select: { id: true, label: true } },
          tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          landlord: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          agreements: { take: 1, orderBy: { version: "desc" } },
        },
      }),
      prisma.tenancy.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getTenancyById(id: string, userId: string, role: string) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({
      where: { id },
      include: {
        property: true,
        unit: true,
        room: true,
        bed: true,
        tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        landlord: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        occupants: true,
        agreements: { orderBy: { version: "desc" } },
        obligations: { orderBy: { dueDate: "asc" } },
        paymentRecords: { orderBy: { paymentDate: "desc" } },
        handovers: true,
      },
    });

    if (!tenancy) throw new NotFoundError("Tenancy", id);

    if (role === "TENANT" && tenancy.tenantId !== userId) {
      throw new ForbiddenError("Permission denied");
    } else if (role !== "TENANT" && role !== "ADMIN") {
      const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId);
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return tenancy;
  }

  static async updateTenancy(id: string, userId: string, data: {
    status?: TenancyStatus;
    startDate?: string;
    endDate?: string;
    propertyReadyDate?: string;
    actualHandoverDate?: string;
    commencementDate?: string;
    actualMoveOutDate?: string;
    rentDueDay?: number;
    terminationReason?: string;
  }) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({ where: { id } });
    if (!tenancy) throw new NotFoundError("Tenancy", id);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.tenancy.update({
        where: { id },
        data: {
          status: data.status,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          propertyReadyDate: data.propertyReadyDate ? new Date(data.propertyReadyDate) : undefined,
          actualHandoverDate: data.actualHandoverDate ? new Date(data.actualHandoverDate) : undefined,
          commencementDate: data.commencementDate ? new Date(data.commencementDate) : undefined,
          actualMoveOutDate: data.actualMoveOutDate ? new Date(data.actualMoveOutDate) : undefined,
          rentDueDay: data.rentDueDay,
          terminationReason: data.terminationReason,
        },
      });

      // If status transitions to ACTIVE: set inventory status to OCCUPIED
      if (data.status === TenancyStatus.ACTIVE) {
        if (tenancy.bedId) {
          await tx.bed.update({ where: { id: tenancy.bedId }, data: { status: InventoryStatus.OCCUPIED } });
        } else if (tenancy.roomId) {
          await tx.room.update({ where: { id: tenancy.roomId }, data: { status: InventoryStatus.OCCUPIED } });
        } else if (tenancy.unitId) {
          await tx.unit.update({ where: { id: tenancy.unitId }, data: { status: InventoryStatus.OCCUPIED } });
        }
      }

      // If status transitions to TERMINATED / COMPLETED: set inventory status to AVAILABLE
      if (data.status === TenancyStatus.TERMINATED || data.status === TenancyStatus.COMPLETED) {
        if (tenancy.bedId) {
          await tx.bed.update({ where: { id: tenancy.bedId }, data: { status: InventoryStatus.AVAILABLE } });
        } else if (tenancy.roomId) {
          await tx.room.update({ where: { id: tenancy.roomId }, data: { status: InventoryStatus.AVAILABLE } });
        } else if (tenancy.unitId) {
          await tx.unit.update({ where: { id: tenancy.unitId }, data: { status: InventoryStatus.AVAILABLE } });
        }
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: `TENANCY_UPDATED_${data.status || "FIELD"}`,
          entityType: "Tenancy",
          entityId: id,
          detailsJson: data,
        },
      });

      return updated;
    });
  }

  // --- Occupants ---
  static async addOccupant(tenancyId: string, userId: string, data: {
    fullName: string;
    phone?: string;
    relationship?: string;
    isPrimary?: boolean;
  }) {
    const prisma = await getPrismaClient();
    const tenancy = await prisma.tenancy.findUnique({ where: { id: tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId);
    if (!hasAccess && tenancy.tenantId !== userId) throw new ForbiddenError("Permission denied");

    return prisma.tenancyOccupant.create({
      data: {
        tenancyId,
        fullName: data.fullName,
        phone: data.phone,
        relationship: data.relationship,
        isPrimary: data.isPrimary ?? false,
      },
    });
  }

  static async removeOccupant(tenancyId: string, occupantId: string, userId: string) {
    const prisma = await getPrismaClient();
    const tenancy = await prisma.tenancy.findUnique({ where: { id: tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId);
    if (!hasAccess && tenancy.tenantId !== userId) throw new ForbiddenError("Permission denied");

    await prisma.tenancyOccupant.delete({ where: { id: occupantId } });
    return { message: "Occupant removed successfully" };
  }

  // --- Digital Tenancy Agreements ---
  static async createAgreement(tenancyId: string, userId: string, data: {
    termsContent: string;
    documentUrl?: string;
  }) {
    const prisma = await getPrismaClient();
    const tenancy = await prisma.tenancy.findUnique({ where: { id: tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    const documentHash = crypto.createHash("sha256").update(data.termsContent).digest("hex");

    // Get latest version count
    const count = await prisma.tenancyAgreement.count({ where: { tenancyId } });

    return prisma.tenancyAgreement.create({
      data: {
        tenancyId,
        version: count + 1,
        termsContent: data.termsContent,
        documentUrl: data.documentUrl,
        documentHash,
        status: AgreementStatus.PENDING_SIGNATURES,
      },
    });
  }

  static async signAgreementTenant(agreementId: string, tenantId: string, ipAddress?: string) {
    const prisma = await getPrismaClient();

    const agreement = await prisma.tenancyAgreement.findUnique({
      where: { id: agreementId },
      include: { tenancy: true },
    });
    if (!agreement) throw new NotFoundError("TenancyAgreement", agreementId);

    if (agreement.tenancy.tenantId !== tenantId) {
      throw new ForbiddenError("Only the tenant can sign this agreement");
    }

    const nextStatus = agreement.landlordSignedAt
      ? AgreementStatus.FULLY_EXECUTED
      : AgreementStatus.TENANT_SIGNED;

    return prisma.tenancyAgreement.update({
      where: { id: agreementId },
      data: {
        tenantSignedAt: new Date(),
        tenantSignIp: ipAddress,
        status: nextStatus,
      },
    });
  }

  static async signAgreementLandlord(agreementId: string, userId: string, ipAddress?: string) {
    const prisma = await getPrismaClient();

    const agreement = await prisma.tenancyAgreement.findUnique({
      where: { id: agreementId },
      include: { tenancy: true },
    });
    if (!agreement) throw new NotFoundError("TenancyAgreement", agreementId);

    const hasAccess = await verifyPropertyAccess(agreement.tenancy.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    const nextStatus = agreement.tenantSignedAt
      ? AgreementStatus.FULLY_EXECUTED
      : AgreementStatus.LANDLORD_SIGNED;

    return prisma.tenancyAgreement.update({
      where: { id: agreementId },
      data: {
        landlordSignedAt: new Date(),
        landlordSignIp: ipAddress,
        status: nextStatus,
      },
    });
  }
}
