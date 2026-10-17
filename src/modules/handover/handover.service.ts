import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "../../lib/errors";
import { AuthUtil } from "../../lib/auth";
import {
  HandoverType,
  HandoverStatus,
  TenancyStatus,
  InventoryStatus,
  ConditionRating,
  ItemCondition,
} from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

// In-memory rate limiting for OTP verification attempts: max 5 attempts before 15-minute lock
const otpAttempts = new Map<string, { count: number; lockedUntil: number }>();

export class HandoverService {
  static async createHandover(userId: string, data: {
    tenancyId: string;
    type: HandoverType;
    scheduledDate: string;
    inspectorId?: string;
    notes?: string;
    items?: Array<{
      area: string;
      item: string;
      condition: ItemCondition;
      notes?: string;
      photoUrls?: string[];
    }>;
  }) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({
      where: { id: data.tenancyId },
      include: { tenant: true },
    });
    if (!tenancy) throw new NotFoundError("Tenancy", data.tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    // Generate 6-digit release OTP
    const releaseOtp = AuthUtil.generateOtp(6);

    return prisma.$transaction(async (tx) => {
      const handover = await tx.handoverInspection.create({
        data: {
          tenancyId: data.tenancyId,
          type: data.type,
          scheduledDate: new Date(data.scheduledDate),
          inspectorId: data.inspectorId,
          notes: data.notes,
          status: HandoverStatus.SCHEDULED,
          releaseOtp,
        },
      });

      if (data.items && data.items.length > 0) {
        await tx.inspectionItem.createMany({
          data: data.items.map((item) => ({
            handoverInspectionId: handover.id,
            area: item.area,
            item: item.item,
            condition: item.condition,
            notes: item.notes,
            photoUrls: item.photoUrls || [],
          })),
        });
      }

      // Send in-app notification to tenant with their handover confirmation PIN
      await tx.notification.create({
        data: {
          recipientId: tenancy.tenantId,
          title: "Property Handover Scheduled",
          message: `Your physical inspection and handover is scheduled. Your confirmation OTP is: ${releaseOtp}. Present this only after you have physically received keys and confirmed the property condition.`,
          actionUrl: `/handovers/${handover.id}`,
        },
      });

      return handover;
    });
  }

  static async updateChecklist(handoverId: string, userId: string, data: {
    keysHandedCount?: number;
    meterReadings?: Record<string, string>;
    overallCondition?: ConditionRating;
    notes?: string;
    items?: Array<{
      id?: string;
      area: string;
      item: string;
      condition: ItemCondition;
      notes?: string;
      photoUrls?: string[];
    }>;
  }) {
    const prisma = await getPrismaClient();

    const handover = await prisma.handoverInspection.findUnique({
      where: { id: handoverId },
      include: { tenancy: true },
    });
    if (!handover) throw new NotFoundError("HandoverInspection", handoverId);

    const hasAccess = await verifyPropertyAccess(handover.tenancy.propertyId, userId);
    if (!hasAccess && handover.tenancy.tenantId !== userId) throw new ForbiddenError("Permission denied");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.handoverInspection.update({
        where: { id: handoverId },
        data: {
          keysHandedCount: data.keysHandedCount,
          meterReadings: data.meterReadings,
          overallCondition: data.overallCondition,
          notes: data.notes,
          status: HandoverStatus.IN_PROGRESS,
        },
      });

      if (data.items) {
        for (const item of data.items) {
          if (item.id) {
            await tx.inspectionItem.update({
              where: { id: item.id },
              data: {
                area: item.area,
                item: item.item,
                condition: item.condition,
                notes: item.notes,
                photoUrls: item.photoUrls || [],
              },
            });
          } else {
            await tx.inspectionItem.create({
              data: {
                handoverInspectionId: handoverId,
                area: item.area,
                item: item.item,
                condition: item.condition,
                notes: item.notes,
                photoUrls: item.photoUrls || [],
              },
            });
          }
        }
      }

      return updated;
    });
  }

  static async getHandover(handoverId: string, userId: string, role: string) {
    const prisma = await getPrismaClient();

    const handover = await prisma.handoverInspection.findUnique({
      where: { id: handoverId },
      include: {
        tenancy: {
          include: {
            property: true,
            tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
            landlord: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
        items: true,
      },
    });

    if (!handover) throw new NotFoundError("HandoverInspection", handoverId);

    const isTenant = handover.tenancy.tenantId === userId;
    const hasAccess = await verifyPropertyAccess(handover.tenancy.propertyId, userId);
    if (!isTenant && !hasAccess) throw new ForbiddenError("Permission denied");

    // Security: Only tenant or completed inspection shows the release OTP
    if (!isTenant && role !== "ADMIN" && handover.status !== HandoverStatus.COMPLETED) {
      handover.releaseOtp = "******";
    }

    return handover;
  }

  static async confirmLandlord(handoverId: string, userId: string) {
    const prisma = await getPrismaClient();

    const handover = await prisma.handoverInspection.findUnique({
      where: { id: handoverId },
      include: { tenancy: true },
    });
    if (!handover) throw new NotFoundError("HandoverInspection", handoverId);

    const hasAccess = await verifyPropertyAccess(handover.tenancy.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.handoverInspection.update({
      where: { id: handoverId },
      data: {
        landlordConfirmed: true,
        landlordConfirmedAt: new Date(),
      },
    });
  }

  // --- Dual OTP Release Handover Completion ("NO KEY, NO PAY") ---
  static async completeWithOtp(handoverId: string, userId: string, otp: string) {
    const prisma = await getPrismaClient();

    const handover = await prisma.handoverInspection.findUnique({
      where: { id: handoverId },
      include: {
        tenancy: true,
      },
    });
    if (!handover) throw new NotFoundError("HandoverInspection", handoverId);

    // Caller authorization: caller must be tenant or property manager
    const isTenant = handover.tenancy.tenantId === userId;
    const isManager = await verifyPropertyAccess(handover.tenancy.propertyId, userId, "canManageApplications");
    if (!isTenant && !isManager) {
      throw new ForbiddenError("Permission denied: You are not a party to this tenancy handover");
    }

    // Status guards
    if (handover.status === HandoverStatus.COMPLETED) {
      throw new ConflictError("Handover inspection has already been marked as COMPLETED");
    }
    if (handover.status === HandoverStatus.CANCELLED) {
      throw new ConflictError("Handover inspection has been CANCELLED");
    }

    // Dual Confirmation enforcement ("NO KEY, NO PAY")
    if (!handover.landlordConfirmed) {
      throw new ConflictError("Physical inspection must be confirmed by the landlord or agent before OTP completion");
    }

    // Brute-force lockout check
    const attemptRecord = otpAttempts.get(handoverId);
    const nowMs = Date.now();
    if (attemptRecord && attemptRecord.lockedUntil > nowMs) {
      const waitMinutes = Math.ceil((attemptRecord.lockedUntil - nowMs) / 60000);
      throw new BadRequestError(`Too many failed OTP attempts. Handover verification is locked for ${waitMinutes} more minute(s).`);
    }

    if (handover.releaseOtp !== otp.trim()) {
      const currentAttempts = (attemptRecord?.count || 0) + 1;
      if (currentAttempts >= 5) {
        otpAttempts.set(handoverId, { count: currentAttempts, lockedUntil: nowMs + 15 * 60 * 1000 });
        throw new BadRequestError("Too many failed OTP attempts. Handover verification locked for 15 minutes.");
      } else {
        otpAttempts.set(handoverId, { count: currentAttempts, lockedUntil: 0 });
        throw new BadRequestError(`Invalid handover release OTP PIN. ${5 - currentAttempts} attempts remaining.`);
      }
    }

    // Clear failed attempts on success
    otpAttempts.delete(handoverId);

    const now = new Date();

    return prisma.$transaction(async (tx) => {
      // 1. Mark handover COMPLETED
      const updatedHandover = await tx.handoverInspection.update({
        where: { id: handoverId },
        data: {
          status: HandoverStatus.COMPLETED,
          completedDate: now,
          tenantConfirmed: true,
          tenantConfirmedAt: now,
        },
      });

      // 2. Lifecycle transition on Tenancy and Inventory
      if (handover.type === HandoverType.MOVE_IN) {
        await tx.tenancy.update({
          where: { id: handover.tenancyId },
          data: {
            status: TenancyStatus.ACTIVE,
            actualHandoverDate: now,
            commencementDate: handover.tenancy.commencementDate || now,
          },
        });

        if (handover.tenancy.bedId) {
          await tx.bed.update({ where: { id: handover.tenancy.bedId }, data: { status: InventoryStatus.OCCUPIED } });
        } else if (handover.tenancy.roomId) {
          await tx.room.update({ where: { id: handover.tenancy.roomId }, data: { status: InventoryStatus.OCCUPIED } });
        } else if (handover.tenancy.unitId) {
          await tx.unit.update({ where: { id: handover.tenancy.unitId }, data: { status: InventoryStatus.OCCUPIED } });
        }
      } else if (handover.type === HandoverType.MOVE_OUT) {
        await tx.tenancy.update({
          where: { id: handover.tenancyId },
          data: {
            status: TenancyStatus.COMPLETED,
            actualMoveOutDate: now,
          },
        });

        if (handover.tenancy.bedId) {
          await tx.bed.update({ where: { id: handover.tenancy.bedId }, data: { status: InventoryStatus.AVAILABLE } });
        } else if (handover.tenancy.roomId) {
          await tx.room.update({ where: { id: handover.tenancy.roomId }, data: { status: InventoryStatus.AVAILABLE } });
        } else if (handover.tenancy.unitId) {
          await tx.unit.update({ where: { id: handover.tenancy.unitId }, data: { status: InventoryStatus.AVAILABLE } });
        }
      }

      // 3. Audit log
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: `HANDOVER_COMPLETED_${handover.type}`,
          entityType: "HandoverInspection",
          entityId: handoverId,
          detailsJson: { tenancyId: handover.tenancyId, type: handover.type, completedAt: now },
        },
      });

      return updatedHandover;
    });
  }
}
