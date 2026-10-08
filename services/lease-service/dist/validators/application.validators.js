"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationValidator = exports.applicationValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.applicationValidator = zod_1.z.object({
    applicantId: zod_1.z.string().min(1, "Applicant ID is required"),
    applicationType: zod_1.z.enum(['property', 'unit', 'room', 'bed']),
    applicationId: zod_1.z.string().min(1, "Application target ID is required"),
    coverLetter: zod_1.z.string().optional(),
    desiredMoveInDate: zod_1.z.string().datetime().optional(),
    applicationFee: zod_1.z.number().min(0, "Application fee must be zero or positive").optional(),
    answers: zod_1.z.any().optional(),
});
exports.updateApplicationValidator = zod_1.z.object({
    coverLetter: zod_1.z.string().optional().nullable(),
    desiredMoveInDate: zod_1.z.string().datetime().optional().nullable(),
    applicationFee: zod_1.z.number().min(0, "Application fee must be zero or positive").optional(),
    answers: zod_1.z.any().optional(),
    status: zod_1.z.nativeEnum(client_1.ApplicationStatus).optional(),
    reviewedAt: zod_1.z.string().datetime().optional().nullable(),
    reviewedBy: zod_1.z.string().optional(),
    applicationFeePaid: zod_1.z.boolean().optional(),
    adminNotes: zod_1.z.string().optional().nullable(),
});
