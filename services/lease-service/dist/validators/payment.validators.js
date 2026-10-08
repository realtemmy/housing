"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentValidator = exports.paymentValidator = void 0;
const zod_1 = require("zod");
exports.paymentValidator = zod_1.z.object({
    paymentType: zod_1.z.enum(['APPLICATION_FEE', 'RESERVATION_FEE', 'DEPOSIT', 'LEASE_PAYMENT']),
    amount: zod_1.z.number().min(0.01, "Amount must be greater than zero"),
    currency: zod_1.z.string().length(3, "Currency code must be 3 characters").optional().default("NGN"),
    customerEmail: zod_1.z.string().email("Invalid email format"),
    customerName: zod_1.z.string().min(1, "Customer name is required"),
    // Reference to what this payment is for
    applicationId: zod_1.z.string().optional(),
    reservationId: zod_1.z.string().optional(),
    leasePaymentId: zod_1.z.string().optional(),
    // Optional: payment method details
    paymentMethodId: zod_1.z.string().optional(),
});
exports.refundPaymentValidator = zod_1.z.object({
    amount: zod_1.z.number().min(0.01, "Refund amount must be greater than zero").optional(),
});
