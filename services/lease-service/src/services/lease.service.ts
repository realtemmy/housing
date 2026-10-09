import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { LeaseStatus, PaymentFrequency, RentableType } from "../generated/prisma/client";
import { Prisma } from "../generated/prisma/client";

export interface CreateLeaseInput {
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  rentAmount: number;
  securityDeposit?: number;
  serviceCharge?: number;
  paymentFrequency?: PaymentFrequency;
  actualMoveInDate?: Date | string;
  agreementUrl?: string | null;
  // RENT TRACKING FIELDS
  rentDueDay?: number; // Day of month rent is due (1-31)
  gracePeriodDays?: number; // Days after due date before late fee applies
  lateFeeAmount?: number; // Fixed late fee amount
  lateFeePercentage?: number; // Percentage of rent for late fee (e.g., 0.05 = 5%)
}

export interface UpdateLeaseInput {
  rentAmount?: number;
  securityDeposit?: number;
  serviceCharge?: number;
  paymentFrequency?: PaymentFrequency;
  status?: LeaseStatus;
  actualMoveInDate?: Date | string | null;
  actualMoveOutDate?: Date | string | null;
  agreementUrl?: string | null;
  terminationReason?: string | null;
  terminationDate?: Date | string | null;
  // RENT TRACKING FIELDS
  rentDueDay?: number; // Day of month rent is due (1-31)
  gracePeriodDays?: number; // Days after due date before late fee applies
  lateFeeAmount?: number; // Fixed late fee amount
  lateFeePercentage?: number; // Percentage of rent for late fee (e.g., 0.05 = 5%)
}

export interface GetLeasesOptions {
  page?: number;
  limit?: number;
  tenantId?: string;
  rentableId?: string;
  rentableType?: RentableType;
  status?: string;
  includeDeleted?: boolean;
}

export class LeaseService {
  async getAllLeases(options: GetLeasesOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      ...(options.tenantId && { tenantId: options.tenantId }),
      ...(options.rentableId && { rentableId: options.rentableId }),
      ...(options.rentableType && { rentableType: options.rentableType }),
      ...(options.status && { status: options.status as LeaseStatus }),
    };

    const [totalItems, leases] = await prisma.$transaction([
      prisma.lease.count({ where: whereClause }),
      prisma.lease.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          tenant: true,
          payments: true,
          renewals: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: leases,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getLeaseById(id: string) {
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        tenant: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
        renewals: {
          orderBy: { requestedAt: "desc" },
        },
      },
    });

    if (!lease) {
      throw new AppError("Lease not found", 404);
    }

    return lease;
  }

  async createLease(input: CreateLeaseInput) {
    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: input.tenantId },
    });

    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    // Calculate total amount
    const rentAmount = new Prisma.Decimal(input.rentAmount.toString());
    const securityDeposit = input.securityDeposit !== undefined
      ? new Prisma.Decimal(input.securityDeposit.toString())
      : new Prisma.Decimal("0");
    const serviceCharge = input.serviceCharge !== undefined
      ? new Prisma.Decimal(input.serviceCharge.toString())
      : new Prisma.Decimal("0");
    const totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);

    const lease = await prisma.lease.create({
      data: {
        rentableId: input.rentableId,
        rentableType: input.rentableType,
        tenantId: input.tenantId,
        rentAmount: rentAmount,
        securityDeposit: securityDeposit,
        serviceCharge: serviceCharge,
        totalAmount: totalAmount,
        paymentFrequency: input.paymentFrequency ?? "YEARLY",
        actualMoveInDate: input.actualMoveInDate
          ? typeof input.actualMoveInDate === "string"
            ? new Date(input.actualMoveInDate)
            : input.actualMoveInDate
          : undefined,
        agreementUrl: input.agreementUrl ?? null,
        // RENT TRACKING FIELDS
        rentDueDay: input.rentDueDay,
        gracePeriodDays: input.gracePeriodDays ?? 5,
        lateFeeAmount: input.lateFeeAmount ?? 0,
        lateFeePercentage: input.lateFeePercentage ?? 0,
        initializedAt: null,
      },
      include: {
        tenant: true,
        payments: true,
        renewals: true,
      },
    });

    return lease;
  }

  async updateLease(id: string, input: UpdateLeaseInput) {
    const existingLease = await prisma.lease.findUnique({
      where: { id },
    });

    if (!existingLease) {
      throw new AppError("Lease not found", 404);
    }

    // Calculate total amount if financial fields are being updated
    let rentAmount = existingLease.rentAmount;
    let securityDeposit = existingLease.securityDeposit;
    let serviceCharge = existingLease.serviceCharge;
    let totalAmount = existingLease.totalAmount;

    if (input.rentAmount !== undefined) {
      rentAmount = new Prisma.Decimal(input.rentAmount.toString());
    }
    if (input.securityDeposit !== undefined) {
      securityDeposit = new Prisma.Decimal(input.securityDeposit.toString());
    }
    if (input.serviceCharge !== undefined) {
      serviceCharge = new Prisma.Decimal(input.serviceCharge.toString());
    }

    if (input.rentAmount !== undefined ||
        input.securityDeposit !== undefined ||
        input.serviceCharge !== undefined) {
      totalAmount = rentAmount.add(securityDeposit).add(serviceCharge);
    }

    const lease = await prisma.lease.update({
      where: { id },
      data: {
        ...(input.rentAmount !== undefined && { rentAmount }),
        ...(input.securityDeposit !== undefined && { securityDeposit }),
        ...(input.serviceCharge !== undefined && { serviceCharge }),
        ...(input.paymentFrequency !== undefined && { paymentFrequency: input.paymentFrequency }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.actualMoveInDate !== undefined && {
          actualMoveInDate: input.actualMoveInDate === null
            ? null
            : typeof input.actualMoveInDate === "string"
              ? new Date(input.actualMoveInDate)
              : input.actualMoveInDate
        }),
        ...(input.actualMoveOutDate !== undefined && {
          actualMoveOutDate: input.actualMoveOutDate === null
            ? null
            : typeof input.actualMoveOutDate === "string"
              ? new Date(input.actualMoveOutDate)
              : input.actualMoveOutDate
        }),
        ...(input.agreementUrl !== undefined && { agreementUrl: input.agreementUrl }),
        ...(input.terminationReason !== undefined && { terminationReason: input.terminationReason }),
        ...(input.terminationDate !== undefined && {
          terminationDate: input.terminationDate === null
            ? null
            : typeof input.terminationDate === "string"
              ? new Date(input.terminationDate)
              : input.terminationDate
        }),
        // RENT TRACKING FIELDS
        ...(input.rentDueDay !== undefined && { rentDueDay: input.rentDueDay }),
        ...(input.gracePeriodDays !== undefined && { gracePeriodDays: input.gracePeriodDays }),
        ...(input.lateFeeAmount !== undefined && { lateFeeAmount: input.lateFeeAmount }),
        ...(input.lateFeePercentage !== undefined && { lateFeePercentage: input.lateFeePercentage }),
        ...(totalAmount !== undefined && { totalAmount }),
        updatedAt: new Date(),
      },
      include: {
        tenant: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
        renewals: {
          orderBy: { requestedAt: "desc" },
        },
      },
    });

    return lease;
  }

  // Note: We won't implement hard delete for leases as they are important for audit/history
  // Instead, we can mark them as CANCELLED or EXPIRED through status updates

  /**
   * Calculate the next rent due date for a lease
   * @param leaseId The ID of the lease
   * @returns The next due date or null if unable to calculate
   */
  async calculateNextRentDueDate(leaseId: string): Promise<Date | null> {
    try {
      const lease = await this.getLeaseById(leaseId);

      // Use actualMoveInDate if available, otherwise use startDate from the lease object
      // Note: In the current schema, we don't have startDate field, so we'll use actualMoveInDate
      // or we might need to add startDate to the lease model in a future update
      const effectiveStartDate = lease.actualMoveInDate || new Date(lease.createdAt);

      if (!effectiveStartDate) {
        return null;
      }

      const nextDueDate = calculateNextDueDate(
        effectiveStartDate,
        lease.paymentFrequency,
        lease.rentDueDay
      );

      return nextDueDate;
    } catch (error) {
      console.error("Error calculating next rent due date:", error);
      return null;
    }
  }

  /**
   * Process recurring rent for all leases that have rent due today
   * This method would typically be called by a scheduled job (cron)
   */
  async processRecurringRent(): Promise<void> {
    try {
      // Get all active leases (status: PENDING or ACTIVE)
      const leasesResult = await this.getAllLeases({
        status: undefined, // We'll get all and filter
        limit: 1000 // Reasonable limit for batch processing
      });

      const activeLeases = leasesResult.items.filter(
        lease => lease.status === "PENDING" || lease.status === "ACTIVE"
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight for date comparison

      for (const lease of activeLeases) {
        try {
          // Calculate next due date
          const nextDueDate = await this.calculateNextRentDueDate(lease.id);

          if (!nextDueDate) {
            continue;
          }

          // Check if rent is due today (within the same day)
          const dueDateCopy = new Date(nextDueDate);
          dueDateCopy.setHours(0, 0, 0, 0);

          if (dueDateCopy.getTime() === today.getTime()) {
            // Rent is due today, create a pending lease payment
            await this.createPendingLeasePayment(lease, nextDueDate);
          }

          // Check for overdue payments and apply late fees
          await this.applyLateFeesIfApplicable(lease);
        } catch (leaseError) {
          console.error(`Error processing rent for lease ${lease.id}:`, leaseError);
          // Continue processing other leases even if one fails
        }
      }
    } catch (error) {
      console.error("Error in processRecurringRent:", error);
      throw error;
    }
  }

  /**
   * Create a pending lease payment record for rent that's due
   * @param lease The lease object
   * @param dueDate The date the rent is due
   */
  async createPendingLeasePayment(lease: any, dueDate: Date): Promise<void> {
    try {
      // Check if there's already a pending payment for this due date
      const existingPayment = await prisma.leasePayment.findFirst({
        where: {
          leaseId: lease.id,
          createdAt: {
            gte: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
            lte: new Date(dueDate.getTime() + 24 * 60 * 60 * 1000) // Next 24 hours
          }
        }
      });

      if (existingPayment) {
        // Payment record already exists for this time period
        return;
      }

      // Create a pending lease payment
      await prisma.leasePayment.create({
        data: {
          leaseId: lease.id,
          amount: lease.rentAmount,
          reference: `RENT-${lease.id}-${dueDate.toISOString().split('T')[0]}`,
          status: "PENDING", // Will be updated when payment is processed
          currency: "NGN",
          paidAt: dueDate // Expected payment date
        }
      });

      // TODO: Send notification about upcoming rent payment
      // This would integrate with notification-service when available
    } catch (error) {
      console.error("Error creating pending lease payment:", error);
      throw error;
    }
  }

  /**
   * Apply late fees to overdue payments
   * @param lease The lease object
   */
  async applyLateFeesIfApplicable(lease: any): Promise<void> {
    try {
      // Skip if no late fee configuration
      if ((lease.lateFeeAmount === 0 || lease.lateFeeAmount === null) &&
          (lease.lateFeePercentage === 0 || lease.lateFeePercentage === null)) {
        return;
      }

      // Get pending or failed payments that are past due
      const overduePayments = await prisma.leasePayment.findMany({
        where: {
          leaseId: lease.id,
          status: { in: ["PENDING", "FAILED"] },
          paidAt: {
            lt: new Date() // Due date is in the past
          }
        }
      });

      for (const payment of overduePayments) {
        try {
          // Check if payment is actually late considering grace period
          const isLate = isPaymentLate(
            payment.paidAt,
            lease.gracePeriodDays ?? 5
          );

          if (isLate) {
            // Calculate late fee
            const lateFee = calculateLateFee(
              lease.rentAmount,
              new Prisma.Decimal(lease.lateFeeAmount || 0),
              new Prisma.Decimal(lease.lateFeePercentage || 0)
            );

            // Update the payment amount to include late fee
            // Note: In a real implementation, we might want to track late fees separately
            const updatedAmount = lease.rentAmount.plus(lateFee);

            await prisma.leasePayment.update({
              where: { id: payment.id },
              data: {
                amount: updatedAmount,
                // We could add a lateFee field here in a future enhancement
                // For now, we're just increasing the total amount due
              }
            });

            // TODO: Send notification about late fee being applied
            // This would integrate with notification-service when available
          }
        } catch (paymentError) {
          console.error(`Error applying late fee to payment ${payment.id}:`, paymentError);
          // Continue processing other payments
        }
      }
    } catch (error) {
      console.error("Error in applyLateFeesIfApplicable:", error);
      throw error;
    }
  }

  /**
   * Update lease status based on payment history
   * - PENDING → ACTIVE after first successful payment
   * This method would typically be called after a payment is processed
   * @param leaseId The ID of the lease to check
   */
  async updateLeaseStatusFromPayments(leaseId: string): Promise<void> {
    try {
      const lease = await this.getLeaseById(leaseId);

      // Only process if lease is currently PENDING
      if (lease.status !== "PENDING") {
        return;
      }

      // Check if there's at least one successful payment
      const successfulPayments = await prisma.leasePayment.count({
        where: {
          leaseId: leaseId,
          status: "SUCCESS"
        }
      });

      if (successfulPayments > 0) {
        // Update lease status to ACTIVE
        await this.updateLease(leaseId, {
          status: "ACTIVE"
        });

        // TODO: Send notification about lease activation
        // This would integrate with notification-service when available
      }
    } catch (error) {
      console.error("Error updating lease status from payments:", error);
      throw error;
    }
  }
}

export default new LeaseService();