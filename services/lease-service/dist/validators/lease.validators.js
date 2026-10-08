"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaseValidator = exports.leaseValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.leaseValidator = zod_1.z.object({
    rentableId: zod_1.z.string().min(1, "Rentable ID is required"),
    rentableType: zod_1.z.nativeEnum(client_1.RentableType),
    tenantId: zod_1.z.string().min(1, "Tenant ID is required"),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive"),
    securityDeposit: zod_1.z.number().min(0, "Security deposit must be zero or positive").optional().default(0),
    serviceCharge: zod_1.z.number().min(0, "Service charge must be zero or positive").optional().default(0),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency).optional(),
    actualMoveInDate: zod_1.z.string().datetime().optional(),
    agreementUrl: zod_1.z.string().url().optional().nullable(),
});
exports.updateLeaseValidator = zod_1.z.object({
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional(),
    securityDeposit: zod_1.z.number().min(0, "Security deposit must be zero or positive").optional(),
    serviceCharge: zod_1.z.number().min(0, "Service charge must be zero or positive").optional(),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency).optional(),
    status: zod_1.z.nativeEnum(client_1.LeaseStatus).optional(),
    actualMoveInDate: zod_1.z.string().datetime().optional().nullable(),
    actualMoveOutDate: zod_1.z.string().datetime().optional().nullable(),
    agreementUrl: zod_1.z.string().url().optional().nullable(),
    terminationReason: zod_1.z.string().optional().nullable(),
    terminationDate: zod_1.z.string().datetime().optional().nullable(),
});
