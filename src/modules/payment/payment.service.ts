import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "../../lib/errors";
import {
  ObligationType,
  ObligationStatus,
  PaymentMethod,
  PaymentVerificationStatus,
} from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class PaymentService {
  // --- Payment Instructions (Landlord Bank Details) ---
  static async setPaymentInstruction(userId: string, data: {
    tenancyId: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    instructions?: string;
    referenceTemplate?: string;
    isActive?: boolean;
  }) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({ where: { id: data.tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", data.tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId, "canRecordPayments");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    // Deactivate previous instructions if this one is active
    if (data.isActive !== false) {
      await prisma.paymentInstruction.updateMany({
        where: { tenancyId: data.tenancyId },
        data: { isActive: false },
      });
    }

    return prisma.paymentInstruction.create({
      data: {
        tenancyId: data.tenancyId,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        instructions: data.instructions,
        referenceTemplate: data.referenceTemplate || `DK-TEN-${data.tenancyId.substring(0, 8).toUpperCase()}`,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async getPaymentInstructions(tenancyId: string, userId: string) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({ where: { id: tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId);
    if (!hasAccess && tenancy.tenantId !== userId) throw new ForbiddenError("Permission denied");

    return prisma.paymentInstruction.findMany({
      where: { tenancyId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // --- Rent Obligations ---
  static async createObligation(userId: string, data: {
    tenancyId: string;
    obligationType: ObligationType;
    dueDate: string;
    periodStart: string;
    periodEnd: string;
    amountDue: number;
    description?: string;
  }) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({ where: { id: data.tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", data.tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId, "canRecordPayments");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.rentObligation.create({
      data: {
        tenancyId: data.tenancyId,
        obligationType: data.obligationType,
        dueDate: new Date(data.dueDate),
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        amountDue: data.amountDue,
        amountPaid: 0,
        balanceRemaining: data.amountDue,
        status: ObligationStatus.PENDING,
        description: data.description,
      },
    });
  }

  // --- Tenant-Reported Payments (No Escrow: Direct Bank Transfer Evidence) ---
  static async reportPayment(userId: string, data: {
    tenancyId: string;
    obligationId?: string;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    bankName?: string;
    accountNumber?: string;
    providerReference: string;
    evidenceUrl: string;
    notes?: string;
  }) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({ where: { id: data.tenancyId } });
    if (!tenancy) throw new NotFoundError("Tenancy", data.tenancyId);

    // Tenant check or property manager check
    const isTenant = tenancy.tenantId === userId;
    const isManager = await verifyPropertyAccess(tenancy.propertyId, userId, "canRecordPayments");
    if (!isTenant && !isManager) throw new ForbiddenError("Permission denied");

    // Prevent duplicate provider reference submissions
    const existingRef = await prisma.paymentRecord.findFirst({
      where: { providerReference: data.providerReference },
    });
    if (existingRef) {
      throw new ConflictError(`A payment record with reference '${data.providerReference}' already exists`);
    }

    return prisma.paymentRecord.create({
      data: {
        tenancyId: data.tenancyId,
        obligationId: data.obligationId,
        recordedById: userId,
        amount: data.amount,
        currency: "NGN",
        paymentDate: new Date(data.paymentDate),
        paymentMethod: data.paymentMethod,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        providerReference: data.providerReference,
        evidenceUrl: data.evidenceUrl,
        notes: data.notes,
        verificationStatus: isManager ? PaymentVerificationStatus.VERIFIED : PaymentVerificationStatus.REPORTED,
        verifiedById: isManager ? userId : undefined,
        verifiedAt: isManager ? new Date() : undefined,
      },
      include: {
        obligation: true,
      },
    });
  }

  // --- Payment Verification by Landlord / Agent ---
  static async verifyPayment(paymentRecordId: string, verifierId: string, data: {
    status: PaymentVerificationStatus;
    rejectionReason?: string;
  }) {
    const prisma = await getPrismaClient();

    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentRecordId },
      include: { tenancy: true, obligation: true },
    });
    if (!payment) throw new NotFoundError("PaymentRecord", paymentRecordId);

    if (payment.verificationStatus === PaymentVerificationStatus.VERIFIED) {
      throw new ConflictError("Payment record is already verified");
    }
    if (payment.verificationStatus === PaymentVerificationStatus.REJECTED) {
      throw new ConflictError("Payment record has already been rejected");
    }

    const hasAccess = await verifyPropertyAccess(payment.tenancy.propertyId, verifierId, "canRecordPayments");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.$transaction(async (tx) => {
      // 1. Update Payment Record
      const updatedPayment = await tx.paymentRecord.update({
        where: { id: paymentRecordId },
        data: {
          verificationStatus: data.status,
          verifiedById: verifierId,
          verifiedAt: new Date(),
          rejectionReason: data.rejectionReason,
        },
      });

      // 2. If VERIFIED: Apply credit to the obligation
      if (data.status === PaymentVerificationStatus.VERIFIED) {
        let targetObligationId = payment.obligationId;

        // If no obligation was linked, find earliest unpaid obligation
        if (!targetObligationId) {
          const earliest = await tx.rentObligation.findFirst({
            where: {
              tenancyId: payment.tenancyId,
              status: { in: [ObligationStatus.PENDING, ObligationStatus.PARTIALLY_PAID, ObligationStatus.OVERDUE] },
            },
            orderBy: { dueDate: "asc" },
          });
          if (earliest) targetObligationId = earliest.id;
        }

        if (targetObligationId) {
          const obligation = await tx.rentObligation.findUnique({ where: { id: targetObligationId } });
          if (obligation) {
            const newPaid = Number(obligation.amountPaid) + Number(payment.amount);
            const newBalance = Math.max(0, Number(obligation.amountDue) - newPaid);
            const newStatus = newBalance <= 0 ? ObligationStatus.PAID : ObligationStatus.PARTIALLY_PAID;

            await tx.rentObligation.update({
              where: { id: targetObligationId },
              data: {
                amountPaid: newPaid,
                balanceRemaining: newBalance,
                status: newStatus,
              },
            });

            // Ensure payment record is linked to this obligation
            if (!payment.obligationId) {
              await tx.paymentRecord.update({
                where: { id: paymentRecordId },
                data: { obligationId: targetObligationId },
              });
            }
          }
        }
      }

      // 3. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: verifierId,
          action: `PAYMENT_${data.status}`,
          entityType: "PaymentRecord",
          entityId: paymentRecordId,
          detailsJson: {
            amount: Number(payment.amount),
            tenancyId: payment.tenancyId,
            status: data.status,
            rejectionReason: data.rejectionReason,
          },
        },
      });

      return updatedPayment;
    });
  }

  // --- Payment Correction / Adjustment ---
  static async correctPayment(paymentRecordId: string, verifierId: string, data: {
    correctedAmount: number;
    reason: string;
  }) {
    const prisma = await getPrismaClient();

    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentRecordId },
      include: { tenancy: true, obligation: true },
    });
    if (!payment) throw new NotFoundError("PaymentRecord", paymentRecordId);

    const hasAccess = await verifyPropertyAccess(payment.tenancy.propertyId, verifierId, "canRecordPayments");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    const previousAmount = Number(payment.amount);
    const amountDifference = data.correctedAmount - previousAmount;

    return prisma.$transaction(async (tx) => {
      // 1. Record correction entry
      await tx.paymentCorrection.create({
        data: {
          paymentRecordId,
          previousAmount,
          correctedAmount: data.correctedAmount,
          reason: data.reason,
          authorizedById: verifierId,
        },
      });

      // 2. Update payment record
      const updatedPayment = await tx.paymentRecord.update({
        where: { id: paymentRecordId },
        data: { amount: data.correctedAmount },
      });

      // 3. Adjust obligation if payment was VERIFIED
      if (payment.verificationStatus === PaymentVerificationStatus.VERIFIED && payment.obligationId) {
        const obligation = await tx.rentObligation.findUnique({ where: { id: payment.obligationId } });
        if (obligation) {
          const newPaid = Number(obligation.amountPaid) + amountDifference;
          const newBalance = Math.max(0, Number(obligation.amountDue) - newPaid);
          const newStatus = newBalance <= 0 ? ObligationStatus.PAID : ObligationStatus.PARTIALLY_PAID;

          await tx.rentObligation.update({
            where: { id: payment.obligationId },
            data: {
              amountPaid: newPaid,
              balanceRemaining: newBalance,
              status: newStatus,
            },
          });
        }
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: verifierId,
          action: "PAYMENT_CORRECTED",
          entityType: "PaymentRecord",
          entityId: paymentRecordId,
          detailsJson: { previousAmount, correctedAmount: data.correctedAmount, reason: data.reason },
        },
      });

      return updatedPayment;
    });
  }

  // --- Statement of Account & Ledger ---
  static async getTenancyLedger(tenancyId: string, userId: string) {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findUnique({
      where: { id: tenancyId },
      include: {
        obligations: { orderBy: { dueDate: "asc" } },
        paymentRecords: {
          orderBy: { paymentDate: "desc" },
          include: { corrections: true },
        },
        paymentInstructions: { where: { isActive: true } },
      },
    });

    if (!tenancy) throw new NotFoundError("Tenancy", tenancyId);

    const hasAccess = await verifyPropertyAccess(tenancy.propertyId, userId);
    if (!hasAccess && tenancy.tenantId !== userId) throw new ForbiddenError("Permission denied");

    const totalDue = tenancy.obligations.reduce((sum, ob) => sum + Number(ob.amountDue), 0);
    const totalPaid = tenancy.obligations.reduce((sum, ob) => sum + Number(ob.amountPaid), 0);
    const totalOutstanding = tenancy.obligations.reduce((sum, ob) => sum + Number(ob.balanceRemaining), 0);

    return {
      tenancyId,
      summary: {
        totalDue,
        totalPaid,
        totalOutstanding,
        currency: "NGN",
      },
      obligations: tenancy.obligations,
      payments: tenancy.paymentRecords,
      paymentInstructions: tenancy.paymentInstructions,
    };
  }
}
