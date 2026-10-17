"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNextDueDateSchema = exports.generatePaymentScheduleSchema = exports.rentPaymentOptionsSchema = exports.updateLeaseSchema = exports.createLeaseSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
/**
 * Validation schema for creating a lease with rent tracking fields
 */
exports.createLeaseSchema = zod_1.z.object({
    rentableId: zod_1.z.string(),
    rentableType: zod_1.z.enum(["UNIT", "ROOM", "BED"]), // Using string enum since RentableType might not be available
    tenantId: zod_1.z.string(),
    rentAmount: zod_1.z.number().positive(),
    securityDeposit: zod_1.z.number().nonnegative().optional(),
    serviceCharge: zod_1.z.number().nonnegative().optional(),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency).optional(),
    actualMoveInDate: zod_1.z.string().datetime().optional(),
    agreementUrl: zod_1.z.string().url().optional().nullable(),
    // RENT TRACKING FIELDS
    rentDueDay: zod_1.z.number().int().min(1).max(31).optional(),
    gracePeriodDays: zod_1.z.number().int().nonnegative().optional(),
    lateFeeAmount: zod_1.z.number().nonnegative().optional(),
    lateFeePercentage: zod_1.z.number().nonnegative().max(1).optional(), // Max 100% (1.0)
});
/**
 * Validation schema for updating a lease with rent tracking fields
 */
exports.updateLeaseSchema = zod_1.z.object({
    rentAmount: zod_1.z.number().positive().optional(),
    securityDeposit: zod_1.z.number().nonnegative().optional(),
    serviceCharge: zod_1.z.number().nonnegative().optional(),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency).optional(),
    status: zod_1.z.nativeEnum(client_1.LeaseStatus).optional(),
    actualMoveInDate: zod_1.z.string().datetime().optional().nullable(),
    actualMoveOutDate: zod_1.z.string().datetime().optional().nullable(),
    agreementUrl: zod_1.z.string().url().optional().nullable(),
    terminationReason: zod_1.z.string().optional(),
    terminationDate: zod_1.z.string().datetime().optional().nullable(),
    // RENT TRACKING FIELDS
    rentDueDay: zod_1.z.number().int().min(1).max(31).optional(),
    gracePeriodDays: zod_1.z.number().int().nonnegative().optional(),
    lateFeeAmount: zod_1.z.number().nonnegative().optional(),
    lateFeePercentage: zod_1.z.number().nonnegative().max(1).optional(), // Max 100% (1.0)
});
/**
 * Validation schema for rent payment processing options
 */
exports.rentPaymentOptionsSchema = zod_1.z.object({
    applyLateFees: zod_1.z.boolean().default(true),
    sendNotifications: zod_1.z.boolean().default(true),
    updateLeaseStatus: zod_1.z.boolean().default(true),
});
/**
 * Validation schema for generating payment schedule
 */
exports.generatePaymentScheduleSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency),
    rentDueDay: zod_1.z.number().int().min(1).max(31).optional(),
});
/**
 * Validation schema for calculating next due date
 */
exports.calculateNextDueDateSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime(),
    paymentFrequency: zod_1.z.nativeEnum(client_1.PaymentFrequency),
    rentDueDay: zod_1.z.number().int().min(1).max(31).optional(),
});
