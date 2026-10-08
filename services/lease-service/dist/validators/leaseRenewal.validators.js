"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaseRenewalValidator = exports.leaseRenewalValidator = void 0;
const zod_1 = require("zod");
exports.leaseRenewalValidator = zod_1.z.object({
    leaseId: zod_1.z.string().min(1, "Lease ID is required"),
    newStart: zod_1.z.string().datetime("New start date must be a valid datetime"),
    newEnd: zod_1.z.string().datetime("New end date must be a valid datetime"),
    newRent: zod_1.z.number().min(0, "New rent amount must be zero or positive").optional(),
    approved: zod_1.z.boolean().optional().default(true),
    notes: zod_1.z.string().optional().nullable(),
});
exports.updateLeaseRenewalValidator = zod_1.z.object({
    newStart: zod_1.z.string().datetime("New start date must be a valid datetime").optional(),
    newEnd: zod_1.z.string().datetime("New end date must be a valid datetime").optional(),
    newRent: zod_1.z.number().min(0, "New rent amount must be zero or positive").optional(),
    approved: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().optional().nullable(),
});
