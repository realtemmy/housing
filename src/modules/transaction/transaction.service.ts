import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import {
  ApplicationStatus,
  OfferStatus,
  ReservationStatus,
  InventoryStatus,
  BillingFrequency,
} from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class TransactionService {
  // --- Applications ---
  static async createApplication(tenantId: string, data: {
    listingId: string;
    monthlyIncome: number;
    employmentStatus: string;
    employerName: string;
    idDocumentUrl?: string;
    guarantorName?: string;
    guarantorPhone?: string;
    proposedMoveInDate: string;
    coverLetter?: string;
  }) {
    const prisma = await getPrismaClient();

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      include: { property: true },
    });

    if (!listing) throw new NotFoundError("Listing", data.listingId);
    if (!listing.property.isActive) {
      throw new BadRequestError("Property is currently inactive");
    }

    // Check if tenant already has a pending/under-review application for this listing
    const existing = await prisma.application.findFirst({
      where: {
        listingId: data.listingId,
        applicantId: tenantId,
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED] },
      },
    });

    if (existing) {
      throw new ConflictError("You already have an active application for this listing");
    }

    const application = await prisma.application.create({
      data: {
        listingId: data.listingId,
        applicantId: tenantId,
        monthlyIncome: data.monthlyIncome,
        employmentStatus: data.employmentStatus,
        employerName: data.employerName,
        idDocumentUrl: data.idDocumentUrl,
        guarantorName: data.guarantorName,
        guarantorPhone: data.guarantorPhone,
        proposedMoveInDate: new Date(data.proposedMoveInDate),
        coverLetter: data.coverLetter,
        status: ApplicationStatus.SUBMITTED,
      },
      include: {
        listing: {
          select: { id: true, headline: true, displayPrice: true, propertyId: true },
        },
      },
    });

    return application;
  }

  static async listApplications(userId: string, role: string, filters: {
    listingId?: string;
    status?: ApplicationStatus;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};
    if (role === "TENANT") {
      where.applicantId = userId;
    } else {
      where.listing = {
        property: {
          OR: [
            { ownerId: userId },
            { agentAssignments: { some: { agentId: userId, isActive: true } } },
          ],
        },
      };
    }

    if (filters.listingId) where.listingId = filters.listingId;
    if (filters.status) where.status = filters.status;

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          listing: {
            select: { id: true, headline: true, displayPrice: true, propertyId: true },
          },
          applicant: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          offers: true,
          reservation: true,
        },
      }),
      prisma.application.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getApplicationById(applicationId: string, userId: string, role: string) {
    const prisma = await getPrismaClient();

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        listing: {
          include: {
            property: true,
            unit: true,
            room: true,
            bed: true,
          },
        },
        applicant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        offers: {
          orderBy: { createdAt: "desc" },
        },
        reservation: true,
      },
    });

    if (!application) throw new NotFoundError("Application", applicationId);

    if (role === "TENANT" && application.applicantId !== userId) {
      throw new ForbiddenError("You cannot view this application");
    } else if (role !== "TENANT" && role !== "ADMIN") {
      const hasAccess = await verifyPropertyAccess(application.listing.propertyId, userId, "canManageApplications");
      if (!hasAccess) throw new ForbiddenError("Permission denied");
    }

    return application;
  }

  static async reviewApplication(applicationId: string, reviewerId: string, data: {
    status: ApplicationStatus;
    decisionNotes?: string;
  }) {
    const prisma = await getPrismaClient();

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { listing: true },
    });
    if (!application) throw new NotFoundError("Application", applicationId);

    const hasAccess = await verifyPropertyAccess(application.listing.propertyId, reviewerId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: data.status,
        decisionNotes: data.decisionNotes,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
    });

    return updated;
  }

  // --- Offers ---
  static async createOffer(userId: string, data: {
    applicationId: string;
    agreedRent: number;
    agreedCautionDeposit: number;
    agreedServiceCharge?: number;
    billingFrequency: BillingFrequency;
    leaseDurationMonths: number;
    notes?: string;
  }) {
    const prisma = await getPrismaClient();

    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { listing: true },
    });
    if (!application) throw new NotFoundError("Application", data.applicationId);

    const hasAccess = await verifyPropertyAccess(application.listing.propertyId, userId, "canManageApplications");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    const offer = await prisma.offer.create({
      data: {
        applicationId: data.applicationId,
        agreedRent: data.agreedRent,
        agreedCautionDeposit: data.agreedCautionDeposit,
        agreedServiceCharge: data.agreedServiceCharge || 0,
        billingFrequency: data.billingFrequency,
        leaseDurationMonths: data.leaseDurationMonths,
        notes: data.notes,
        status: OfferStatus.PENDING,
      },
    });

    return offer;
  }

  static async respondOffer(offerId: string, tenantId: string, data: {
    status: OfferStatus;
    notes?: string;
  }) {
    const prisma = await getPrismaClient();

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        application: true,
      },
    });
    if (!offer) throw new NotFoundError("Offer", offerId);

    if (offer.application.applicantId !== tenantId) {
      throw new ForbiddenError("Only the applicant can respond to this offer");
    }

    return prisma.offer.update({
      where: { id: offerId },
      data: {
        status: data.status,
        notes: data.notes ? `${offer.notes || ""}\nTenant response: ${data.notes}` : offer.notes,
      },
    });
  }

  // --- Concurrency-Safe Reservation Hold (Double-booking prevention) ---
  static async createReservationHold(userId: string, data: {
    applicationId: string;
    holdHours: number;
    holdFeeAmount?: number;
  }) {
    const prisma = await getPrismaClient();

    // Verify application
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: {
        listing: {
          include: {
            unit: true,
            room: true,
            bed: true,
          },
        },
      },
    });

    if (!application) throw new NotFoundError("Application", data.applicationId);
    if (application.applicantId !== userId) {
      throw new ForbiddenError("You can only reserve inventory for your own approved application");
    }
    if (application.status !== ApplicationStatus.APPROVED) {
      throw new BadRequestError("Application must be APPROVED before placing a reservation hold");
    }

    const { listing } = application;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + data.holdHours * 3600 * 1000);

    // Execute atomic transaction with pessimistic locking
    return prisma.$transaction(async (tx) => {
      // 1. Determine inventory target and lock the row
      if (listing.bedId) {
        const beds: any[] = await tx.$queryRaw`
          SELECT id, status FROM "Bed" WHERE id = ${listing.bedId} FOR UPDATE
        `;
        if (!beds || beds.length === 0) throw new NotFoundError("Bed", listing.bedId);
        if (beds[0].status !== InventoryStatus.AVAILABLE) {
          throw new ConflictError(`This bed is not available for reservation (current status: ${beds[0].status})`);
        }

        // Check active hold
        const activeHold = await tx.reservation.findFirst({
          where: {
            bedId: listing.bedId,
            status: ReservationStatus.ACTIVE_HOLD,
            expiresAt: { gt: now },
          },
        });
        if (activeHold) {
          throw new ConflictError("This bed is currently reserved under an active hold");
        }

        await tx.bed.update({
          where: { id: listing.bedId },
          data: { status: InventoryStatus.RESERVED },
        });
      } else if (listing.roomId) {
        const rooms: any[] = await tx.$queryRaw`
          SELECT id, status FROM "Room" WHERE id = ${listing.roomId} FOR UPDATE
        `;
        if (!rooms || rooms.length === 0) throw new NotFoundError("Room", listing.roomId);
        if (rooms[0].status !== InventoryStatus.AVAILABLE) {
          throw new ConflictError(`This room is not available for reservation (current status: ${rooms[0].status})`);
        }

        const activeHold = await tx.reservation.findFirst({
          where: {
            roomId: listing.roomId,
            status: ReservationStatus.ACTIVE_HOLD,
            expiresAt: { gt: now },
          },
        });
        if (activeHold) {
          throw new ConflictError("This room is currently reserved under an active hold");
        }

        await tx.room.update({
          where: { id: listing.roomId },
          data: { status: InventoryStatus.RESERVED },
        });
      } else if (listing.unitId) {
        const units: any[] = await tx.$queryRaw`
          SELECT id, status FROM "Unit" WHERE id = ${listing.unitId} FOR UPDATE
        `;
        if (!units || units.length === 0) throw new NotFoundError("Unit", listing.unitId);
        if (units[0].status !== InventoryStatus.AVAILABLE) {
          throw new ConflictError(`This unit is not available for reservation (current status: ${units[0].status})`);
        }

        const activeHold = await tx.reservation.findFirst({
          where: {
            unitId: listing.unitId,
            status: ReservationStatus.ACTIVE_HOLD,
            expiresAt: { gt: now },
          },
        });
        if (activeHold) {
          throw new ConflictError("This unit is currently reserved under an active hold");
        }

        await tx.unit.update({
          where: { id: listing.unitId },
          data: { status: InventoryStatus.RESERVED },
        });
      }

      // 2. Create the reservation record
      const reservation = await tx.reservation.create({
        data: {
          applicationId: data.applicationId,
          tenantId: userId,
          unitId: listing.unitId,
          roomId: listing.roomId,
          bedId: listing.bedId,
          status: ReservationStatus.ACTIVE_HOLD,
          expiresAt,
          holdFeeAmount: data.holdFeeAmount || 0,
          holdFeePaid: false,
        },
      });

      // 3. Audit log
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "RESERVATION_HOLD_CREATED",
          entityType: "Reservation",
          entityId: reservation.id,
          detailsJson: {
            applicationId: data.applicationId,
            unitId: listing.unitId,
            roomId: listing.roomId,
            bedId: listing.bedId,
            expiresAt,
          },
        },
      });

      return reservation;
    });
  }

  static async cancelReservationHold(reservationId: string, userId: string) {
    const prisma = await getPrismaClient();

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        application: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!reservation) throw new NotFoundError("Reservation", reservationId);

    // Permission check: tenant or property manager
    const isTenant = reservation.tenantId === userId;
    const isManager = reservation.application?.listing?.propertyId
      ? await verifyPropertyAccess(reservation.application.listing.propertyId, userId, "canManageApplications")
      : false;

    if (!isTenant && !isManager) {
      throw new ForbiddenError("Permission denied");
    }

    if (reservation.status !== ReservationStatus.ACTIVE_HOLD) {
      throw new ConflictError(`Cannot cancel reservation with status ${reservation.status}. Only active holds can be cancelled.`);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CANCELLED },
      });

      // Reset inventory item status back to AVAILABLE ONLY if currently RESERVED
      if (reservation.bedId) {
        await tx.bed.updateMany({
          where: { id: reservation.bedId, status: InventoryStatus.RESERVED },
          data: { status: InventoryStatus.AVAILABLE },
        });
      } else if (reservation.roomId) {
        await tx.room.updateMany({
          where: { id: reservation.roomId, status: InventoryStatus.RESERVED },
          data: { status: InventoryStatus.AVAILABLE },
        });
      } else if (reservation.unitId) {
        await tx.unit.updateMany({
          where: { id: reservation.unitId, status: InventoryStatus.RESERVED },
          data: { status: InventoryStatus.AVAILABLE },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "RESERVATION_HOLD_CANCELLED",
          entityType: "Reservation",
          entityId: reservationId,
          detailsJson: { cancelledBy: userId, isTenant, isManager },
        },
      });

      return updated;
    });
  }

  static async getReservation(reservationId: string) {
    const prisma = await getPrismaClient();
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        unit: true,
        room: true,
        bed: true,
        application: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!reservation) throw new NotFoundError("Reservation", reservationId);
    return reservation;
  }
}
