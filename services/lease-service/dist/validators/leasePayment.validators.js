"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeasePaymentValidator = exports.leasePaymentValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.leasePaymentValidator = zod_1.z.object({
    leaseId: zod_1.z.string().min(1, "Lease ID is required"),
    amount: zod_1.z.number().min(0.01, "Amount must be greater than zero"),
    reference: zod_1.z.string().min(1, "Payment reference is required"),
    status: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    currency: zod_1.z.string().min(3, "Currency code must be at least 3 characters").optional().default("NGN"),
    paymentId: zod_1.z.string().optional(),
});
exports.updateLeasePaymentValidator = zod_1.z.object({
    amount: zod_1.z.number().min(0.01, "Amount must be greater than zero").optional(),
    reference: zod_1.z.string().min(1, "Payment reference is required").optional(),
    status: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    currency: zod_1.z.string().min(3, "Currency code must be at least 3 characters").optional(),
    paymentId: zod_1.z.string().optional(),
    paidAt: zod_1.z.string().datetime().optional().nullable(),
});
