import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client";

// Define enum types since they're not available in the truncated Prisma client
export enum PaymentGateway {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
  STRIPE = 'STRIPE'
}

export enum PaymentTransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export type PaymentType = 'APPLICATION_FEE' | 'RESERVATION_FEE' | 'DEPOSIT' | 'LEASE_PAYMENT';

export interface ProcessPaymentInput {
  paymentType: PaymentType;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  // Reference to what this payment is for
  applicationId?: string;
  reservationId?: string;
  leasePaymentId?: string;
  // Optional: payment method details (would be used by real gateway)
  paymentMethodId?: string;
}

export interface PaymentProcessResult {
  success: boolean;
  transactionId: string;
  gatewayTransactionId: string | null;
  amount: number;
  currency: string;
  status: string; // PaymentTransactionStatus
  message: string;
}

export class PaymentService {
  // Process a payment through the payment gateway
  async processPayment(input: ProcessPaymentInput): Promise<PaymentProcessResult> {
    // Validate that exactly one reference is provided
    const references = [input.applicationId, input.reservationId, input.leasePaymentId].filter(ref => ref !== undefined && ref !== null);
    if (references.length === 0) {
      throw new AppError("Either applicationId, reservationId, or leasePaymentId must be provided", 400);
    }
    if (references.length > 1) {
      throw new AppError("Only one of applicationId, reservationId, or leasePaymentId should be provided", 400);
    }

    // Validate the referenced entity exists
    if (input.applicationId) {
      const application = await this.findApplicationById(input.applicationId);
      if (!application) {
        throw new AppError("Application not found", 404);
      }
      // Additional validation: check if payment type matches
      if (input.paymentType === 'APPLICATION_FEE' && application.applicationFeePaid) {
        throw new AppError("Application fee already paid", 400);
      }
    } else if (input.reservationId) {
      const reservation = await this.findReservationById(input.reservationId);
      if (!reservation) {
        throw new AppError("Reservation not found", 404);
      }
      // Additional validation: check if payment type matches
      if (input.paymentType === 'RESERVATION_FEE' && reservation.reservationFeePaid) {
        throw new AppError("Reservation fee already paid", 400);
      }
      if (input.paymentType === 'DEPOSIT' && reservation.depositPaid) {
        throw new AppError("Deposit already paid", 400);
      }
    } else if (input.leasePaymentId) {
      const leasePayment = await prisma.leasePayment.findUnique({
        where: { id: input.leasePaymentId },
      });
      if (!leasePayment) {
        throw new AppError("Lease payment not found", 404);
      }
      // Note: LeasePayment doesn't have a "paid" flag - it's considered paid when created
      // In a real system, we might check if it's already processed
    }

    // Set default currency
    const currency = input.currency ?? "NGN";

    // Simulate payment gateway integration
    // In a real implementation, this would call the actual payment gateway API
    const gateway = PaymentGateway.PAYSTACK; // Default gateway for simulation
    const gatewayTransactionId = `gw_${Math.random().toString(36).substr(2, 9)}`;
    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment processing (random success/failure for demo)
    // In reality, this would depend on the gateway response
    const randomSuccess = Math.random() > 0.1; // 90% success rate for demo
    const status = randomSuccess ? PaymentTransactionStatus.SUCCESS : PaymentTransactionStatus.FAILED;

    // Create payment transaction record
    const paymentTransaction = await this.createPaymentTransaction({
      ...(input.applicationId && { applicationId: input.applicationId }),
      ...(input.reservationId && { reservationId: input.reservationId }),
      ...(input.leasePaymentId && { leasePaymentId: input.leasePaymentId }),
      gateway,
      gatewayTransactionId,
      amount: new Prisma.Decimal(input.amount.toString()),
      currency,
      status,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      // In a real implementation, gatewayResponse would contain the actual gateway response
      gatewayResponse: {
        success: randomSuccess,
        message: randomSuccess ? "Payment successful" : "Payment failed: Insufficient funds",
        gateway: gateway,
        transactionId: gatewayTransactionId,
      },
    });

    // If payment was successful, update the relevant entity
    if (status === PaymentTransactionStatus.SUCCESS) {
      let updateSuccess = false;

      if (input.applicationId) {
        // Update application fee paid status
        await this.updateApplicationFeePaid(input.applicationId, true);
        updateSuccess = true;
      } else if (input.reservationId) {
        // Update reservation fee or deposit paid status
        const reservation = await this.findReservationById(input.reservationId);
        if (reservation) {
          // For updating reservation, we need to get the full reservation to check fee amounts
          const fullReservation = await this.getFullReservationById(input.reservationId);
          if (fullReservation) {
            const updateData: any = {};
            if (input.paymentType === 'RESERVATION_FEE' && fullReservation.reservationFee !== null) {
              await this.updateReservationFeePaid(input.reservationId, true);
            }
            if (input.paymentType === 'DEPOSIT' && fullReservation.depositAmount !== null) {
              await this.updateReservationDepositPaid(input.reservationId, true);
            }
            updateSuccess = true;
          }
        }
      } else if (input.leasePaymentId) {
        // For lease payments, we might create a separate record or update existing
        // Actually, LeasePayment already represents a payment record
        // In this case, we're just recording that the payment was processed successfully
        // The LeasePayment record already exists - we're just confirming payment
        updateSuccess = true;
      }

      if (!updateSuccess) {
        // Log warning but don't fail the payment
        console.warn("Payment processed but failed to update related entity");
      }
    }

    // Return result
    return {
      success: status === PaymentTransactionStatus.SUCCESS,
      transactionId: paymentTransaction.id,
      gatewayTransactionId: paymentTransaction.gatewayTransactionId,
      amount: Number(paymentTransaction.amount),
      currency: paymentTransaction.currency,
      status: paymentTransaction.status,
      message: status === PaymentTransactionStatus.SUCCESS
        ? "Payment processed successfully"
        : "Payment processing failed",
    };
  }

  // Helper method to find application by ID (using raw SQL due to missing model accessor)
  private async findApplicationById(id: string) {
    try {
      const result = await prisma.$queryRaw<
        Array<{ id: string; applicantId: string; applicationFeePaid: boolean }>
      >`SELECT id, applicantId, applicationFeePaid FROM "Application" WHERE id = ${id} LIMIT 1`;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error finding application by ID:", error);
      return null;
    }
  }

  // Helper method to find reservation by ID (using raw SQL due to missing model accessor)
  private async findReservationById(id: string) {
    try {
      const result = await prisma.$queryRaw<
        Array<{
          id: string;
          reservorId: string;
          reservationFeePaid: boolean;
          depositPaid: boolean
        }>
      >`SELECT id, reservorId, reservationFeePaid, depositPaid FROM "Reservation" WHERE id = ${id} LIMIT 1`;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error finding reservation by ID:", error);
      return null;
    }
  }

  // Helper method to get full reservation by ID (including fee amounts)
  private async getFullReservationById(id: string) {
    try {
      const result = await prisma.$queryRaw<
        Array<{
          id: string;
          reservorId: string;
          reservationFee: any; // Using any since we don't have the exact type
          reservationFeePaid: boolean;
          depositAmount: any; // Using any since we don't have the exact type
          depositPaid: boolean
        }>
      >`SELECT id, reservorId, reservationFee, reservationFeePaid, depositAmount, depositPaid FROM "Reservation" WHERE id = ${id} LIMIT 1`;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting full reservation by ID:", error);
      return null;
    }
  }

  // Helper method to update application fee paid status (using raw SQL due to missing model accessor)
  private async updateApplicationFeePaid(applicationId: string, paid: boolean) {
    try {
      await prisma.$executeRaw`
        UPDATE "Application"
        SET applicationFeePaid = ${paid}
        WHERE id = ${applicationId}
      `;
    } catch (error) {
      console.error("Error updating application fee paid:", error);
      throw error;
    }
  }

  // Helper method to update reservation fee paid status (using raw SQL due to missing model accessor)
  private async updateReservationFeePaid(reservationId: string, paid: boolean) {
    try {
      await prisma.$executeRaw`
        UPDATE "Reservation"
        SET reservationFeePaid = ${paid}
        WHERE id = ${reservationId}
      `;
    } catch (error) {
      console.error("Error updating reservation fee paid:", error);
      throw error;
    }
  }

  // Helper method to update reservation deposit paid status (using raw SQL due to missing model accessor)
  private async updateReservationDepositPaid(reservationId: string, paid: boolean) {
    try {
      await prisma.$executeRaw`
        UPDATE "Reservation"
        SET depositPaid = ${paid}
        WHERE id = ${reservationId}
      `;
    } catch (error) {
      console.error("Error updating reservation deposit paid:", error);
      throw error;
    }
  }

  // Create payment transaction record (PaymentTransaction model accessor is missing, using raw SQL)
  private async createPaymentTransaction(data: any) {
    try {
      const result = await prisma.$queryRaw<
        Array<{
          id: string;
          gatewayTransactionId: string | null;
        }>
      >`
        INSERT INTO "PaymentTransaction" (
          id,
          applicationId,
          reservationId,
          leasePaymentId,
          gateway,
          gatewayTransactionId,
          amount,
          currency,
          status,
          customerEmail,
          customerName,
          gatewayResponse,
          createdAt,
          updatedAt
        ) VALUES (
          ${data.id ?? `txn_${Math.random().toString(36).substr(2, 9)}`},
          ${data.applicationId ?? null},
          ${data.reservationId ?? null},
          ${data.leasePaymentId ?? null},
          ${data.gateway},
          ${data.gatewayTransactionId ?? null},
          ${data.amount},
          ${data.currency},
          ${data.status},
          ${data.customerEmail ?? null},
          ${data.customerName ?? null},
          ${JSON.stringify(data.gatewayResponse ?? {})},
          NOW(),
          NOW()
        ) RETURNING id, gatewayTransactionId
      `;

      // Return a mock object that mimics what the real create method would return
      // We spread data first, then override id and gatewayTransactionId with the actual values from the DB
      return {
        ...data,
        id: result[0].id,
        gatewayTransactionId: result[0].gatewayTransactionId,
      } as any;
    } catch (error) {
      console.error("Error creating payment transaction:", error);
      throw error;
    }
  }

  // Refund a payment
  async refundPayment(transactionId: string, amount?: number): Promise<PaymentProcessResult> {
    const transaction = await this.getPaymentTransactionById(transactionId);

    if (!transaction) {
      throw new AppError("Payment transaction not found", 404);
    }

    if (transaction.status !== PaymentTransactionStatus.SUCCESS) {
      throw new AppError("Only successful payments can be refunded", 400);
    }

    // In a real implementation, this would call the gateway refund API
    // For now, we'll simulate it
    const refundAmount = amount ?? Number(transaction.amount);
    const gatewayRefundId = `refund_${Math.random().toString(36).substr(2, 9)}`;

    // Update transaction status to refunded
    await this.updatePaymentTransactionStatus(transactionId, PaymentTransactionStatus.REFUNDED, {
      ...(transaction.gatewayResponse as any),
      refunded: true,
      refundAmount: refundAmount,
      refundId: gatewayRefundId,
    });

    // If this was an application fee refund, update application
    if (transaction.applicationId) {
      await this.updateApplicationFeePaid(transaction.applicationId, false);
    }
    // If this was a reservation fee refund, update reservation
    else if (transaction.reservationId) {
      const reservation = await this.getFullReservationById(transaction.reservationId);
      if (reservation) {
        const updateData: any = {};
        if (transaction.amount?.equals(reservation.reservationFee ?? 0)) {
          await this.updateReservationFeePaid(transaction.reservationId, false);
        }
        if (transaction.amount?.equals(reservation.depositAmount ?? 0)) {
          await this.updateReservationDepositPaid(transaction.reservationId, false);
        }
      }
    }
    // Note: For lease payments, refunding would be more complex and might involve
    // creating a negative lease payment or updating the lease
    // We'll skip that for now as it's more complex

    return {
      success: true,
      transactionId: transaction.id,
      gatewayTransactionId: transaction.gatewayTransactionId,
      amount: refundAmount,
      currency: transaction.currency,
      status: PaymentTransactionStatus.REFUNDED,
      message: "Payment refunded successfully",
    };
  }

  // Get payment transaction by ID
  async getPaymentTransactionById(id: string) {
    try {
      const result = await prisma.$queryRaw<
        Array<any>
      >`SELECT * FROM "PaymentTransaction" WHERE id = ${id} LIMIT 1`;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting payment transaction by ID:", error);
      return null;
    }
  }

  // Update payment transaction status and gateway response
  private async updatePaymentTransactionStatus(
    transactionId: string,
    status: string,
    gatewayResponse: any
  ) {
    try {
      await prisma.$executeRaw`
        UPDATE "PaymentTransaction"
        SET status = ${status},
            gatewayResponse = ${JSON.stringify(gatewayResponse)}
        WHERE id = ${transactionId}
      `;
    } catch (error) {
      console.error("Error updating payment transaction status:", error);
      throw error;
    }
  }

  // Get payment transactions for a specific entity
  async getPaymentsForApplication(applicationId: string, options: { page?: number; limit?: number } = {}) {
    try {
      const page = options.page && options.page > 0 ? options.page : 1;
      const limit = options.limit && options.limit > 0 ? options.limit : 20;
      const skip = (page - 1) * limit;

      // First, get the total count
      const countResult = await prisma.$queryRaw<
        Array<{ count: number }>
      >`SELECT COUNT(*) as count FROM "PaymentTransaction" WHERE applicationId = ${applicationId}`;
      const totalItems = countResult.length > 0 ? Number(countResult[0].count) : 0;

      // Then, get the paginated results
      const result = await prisma.$queryRaw<
        Array<any>
      >`
        SELECT * FROM "PaymentTransaction"
        WHERE applicationId = ${applicationId}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: result,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };
    } catch (error) {
      console.error("Error getting payments for application:", error);
      throw error;
    }
  }

  async getPaymentsForReservation(reservationId: string, options: { page?: number; limit?: number } = {}) {
    try {
      const page = options.page && options.page > 0 ? options.page : 1;
      const limit = options.limit && options.limit > 0 ? options.limit : 20;
      const skip = (page - 1) * limit;

      // First, get the total count
      const countResult = await prisma.$queryRaw<
        Array<{ count: number }>
      >`SELECT COUNT(*) as count FROM "PaymentTransaction" WHERE reservationId = ${reservationId}`;
      const totalItems = countResult.length > 0 ? Number(countResult[0].count) : 0;

      // Then, get the paginated results
      const result = await prisma.$queryRaw<
        Array<any>
      >`
        SELECT * FROM "PaymentTransaction"
        WHERE reservationId = ${reservationId}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: result,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };
    } catch (error) {
      console.error("Error getting payments for reservation:", error);
      throw error;
    }
  }

  async getPaymentsForLeasePayment(leasePaymentId: string, options: { page?: number; limit?: number } = {}) {
    try {
      const page = options.page && options.page > 0 ? options.page : 1;
      const limit = options.limit && options.limit > 0 ? options.limit : 20;
      const skip = (page - 1) * limit;

      // First, get the total count
      const countResult = await prisma.$queryRaw<
        Array<{ count: number }>
      >`SELECT COUNT(*) as count FROM "PaymentTransaction" WHERE leasePaymentId = ${leasePaymentId}`;
      const totalItems = countResult.length > 0 ? Number(countResult[0].count) : 0;

      // Then, get the paginated results
      const result = await prisma.$queryRaw<
        Array<any>
      >`
        SELECT * FROM "PaymentTransaction"
        WHERE leasePaymentId = ${leasePaymentId}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: result,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };
    } catch (error) {
      console.error("Error getting payments for lease payment:", error);
      throw error;
    }
  }
}

export default new PaymentService();