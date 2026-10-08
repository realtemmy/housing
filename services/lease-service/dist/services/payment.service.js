"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class PaymentService {
    // Process a payment through the payment gateway
    async processPayment(input) {
        // Validate that exactly one reference is provided
        const references = [input.applicationId, input.reservationId, input.leasePaymentId].filter(ref => ref !== undefined && ref !== null);
        if (references.length === 0) {
            throw new appError_1.default("Either applicationId, reservationId, or leasePaymentId must be provided", 400);
        }
        if (references.length > 1) {
            throw new appError_1.default("Only one of applicationId, reservationId, or leasePaymentId should be provided", 400);
        }
        // Validate the referenced entity exists
        if (input.applicationId) {
            const application = await prisma_1.prisma.application.findUnique({
                where: { id: input.applicationId },
            });
            if (!application) {
                throw new appError_1.default("Application not found", 404);
            }
            // Additional validation: check if payment type matches
            if (input.paymentType === 'APPLICATION_FEE' && application.applicationFeePaid) {
                throw new appError_1.default("Application fee already paid", 400);
            }
        }
        else if (input.reservationId) {
            const reservation = await prisma_1.prisma.reservation.findUnique({
                where: { id: input.reservationId },
            });
            if (!reservation) {
                throw new appError_1.default("Reservation not found", 404);
            }
            // Additional validation: check if payment type matches
            if (input.paymentType === 'RESERVATION_FEE' && reservation.reservationFeePaid) {
                throw new appError_1.default("Reservation fee already paid", 400);
            }
            if (input.paymentType === 'DEPOSIT' && reservation.depositPaid) {
                throw new appError_1.default("Deposit already paid", 400);
            }
        }
        else if (input.leasePaymentId) {
            const leasePayment = await prisma_1.prisma.leasePayment.findUnique({
                where: { id: input.leasePaymentId },
            });
            if (!leasePayment) {
                throw new appError_1.default("Lease payment not found", 404);
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
        const status = randomSuccess ? client_1.PaymentTransactionStatus.SUCCESS : client_1.PaymentTransactionStatus.FAILED;
        // Create payment transaction record
        const paymentTransaction = await prisma_1.prisma.paymentTransaction.create({
            data: {
                ...(input.applicationId && { applicationId: input.applicationId }),
                ...(input.reservationId && { reservationId: input.reservationId }),
                ...(input.leasePaymentId && { leasePaymentId: input.leasePaymentId }),
                gateway,
                gatewayTransactionId,
                amount: new client_1.Prisma.Decimal(input.amount.toString()),
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
            },
        });
        // If payment was successful, update the relevant entity
        if (status === client_1.PaymentTransactionStatus.SUCCESS) {
            let updateSuccess = false;
            if (input.applicationId) {
                // Update application fee paid status
                await prisma_1.prisma.application.update({
                    where: { id: input.applicationId },
                    data: {
                        applicationFeePaid: true,
                    },
                });
                updateSuccess = true;
            }
            else if (input.reservationId) {
                // Update reservation fee or deposit paid status
                const reservation = await prisma_1.prisma.reservation.findUnique({
                    where: { id: input.reservationId },
                });
                if (reservation) {
                    const updateData = {};
                    if (input.paymentType === 'RESERVATION_FEE' && reservation.reservationFee !== null) {
                        updateData.reservationFeePaid = true;
                    }
                    if (input.paymentType === 'DEPOSIT' && reservation.depositAmount !== null) {
                        updateData.depositPaid = true;
                    }
                    if (Object.keys(updateData).length > 0) {
                        await prisma_1.prisma.reservation.update({
                            where: { id: input.reservationId },
                            data: updateData,
                        });
                        updateSuccess = true;
                    }
                }
            }
            else if (input.leasePaymentId) {
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
            success: status === client_1.PaymentTransactionStatus.SUCCESS,
            transactionId: paymentTransaction.id,
            gatewayTransactionId: paymentTransaction.gatewayTransactionId,
            amount: Number(paymentTransaction.amount),
            currency: paymentTransaction.currency,
            status: paymentTransaction.status,
            message: status === client_1.PaymentTransactionStatus.SUCCESS
                ? "Payment processed successfully"
                : "Payment processing failed",
        };
    }
    // Refund a payment
    async refundPayment(transactionId, amount) {
        const transaction = await prisma_1.prisma.paymentTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) {
            throw new appError_1.default("Payment transaction not found", 404);
        }
        if (transaction.status !== client_1.PaymentTransactionStatus.SUCCESS) {
            throw new appError_1.default("Only successful payments can be refunded", 400);
        }
        // In a real implementation, this would call the gateway refund API
        // For now, we'll simulate it
        const refundAmount = amount ?? Number(transaction.amount);
        const gatewayRefundId = `refund_${Math.random().toString(36).substr(2, 9)}`;
        // Update transaction status to refunded
        await prisma_1.prisma.paymentTransaction.update({
            where: { id: transactionId },
            data: {
                status: client_1.PaymentTransactionStatus.REFUNDED,
                gatewayResponse: {
                    ...transaction.gatewayResponse,
                    refunded: true,
                    refundAmount: refundAmount,
                    refundId: gatewayRefundId,
                },
            },
        });
        // If this was an application fee refund, update application
        if (transaction.applicationId) {
            await prisma_1.prisma.application.update({
                where: { id: transaction.applicationId },
                data: {
                    applicationFeePaid: false,
                },
            });
        }
        // If this was a reservation fee refund, update reservation
        else if (transaction.reservationId) {
            const reservation = await prisma_1.prisma.reservation.findUnique({
                where: { id: transaction.reservationId },
            });
            if (reservation) {
                const updateData = {};
                if (transaction.amount?.equals(reservation.reservationFee ?? 0)) {
                    updateData.reservationFeePaid = false;
                }
                if (transaction.amount?.equals(reservation.depositAmount ?? 0)) {
                    updateData.depositPaid = false;
                }
                if (Object.keys(updateData).length > 0) {
                    await prisma_1.prisma.reservation.update({
                        where: { id: transaction.reservationId },
                        data: updateData,
                    });
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
            status: client_1.PaymentTransactionStatus.REFUNDED,
            message: "Payment refunded successfully",
        };
    }
    // Get payment transaction by ID
    async getPaymentTransactionById(id) {
        const transaction = await prisma_1.prisma.paymentTransaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new appError_1.default("Payment transaction not found", 404);
        }
        return transaction;
    }
    // Get payment transactions for a specific entity
    async getPaymentsForApplication(applicationId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        const [totalItems, transactions] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.paymentTransaction.count({ where: { applicationId } }),
            prisma_1.prisma.paymentTransaction.findMany({
                skip,
                take: limit,
                where: { applicationId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: transactions,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getPaymentsForReservation(reservationId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        const [totalItems, transactions] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.paymentTransaction.count({ where: { reservationId } }),
            prisma_1.prisma.paymentTransaction.findMany({
                skip,
                take: limit,
                where: { reservationId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: transactions,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getPaymentsForLeasePayment(leasePaymentId, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        const [totalItems, transactions] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.paymentTransaction.count({ where: { leasePaymentId } }),
            prisma_1.prisma.paymentTransaction.findMany({
                skip,
                take: limit,
                where: { leasePaymentId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: transactions,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
}
exports.PaymentService = PaymentService;
exports.default = new PaymentService();
