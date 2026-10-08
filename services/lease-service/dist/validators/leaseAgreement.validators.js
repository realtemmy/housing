"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateLeaseAgreementValidator = exports.executeLeaseAgreementValidator = exports.signLeaseAgreementValidator = exports.generateLeaseAgreementValidator = void 0;
const zod_1 = require("zod");
exports.generateLeaseAgreementValidator = zod_1.z.object({
    leaseId: zod_1.z.string().uuid("Lease ID must be a valid UUID"),
    customFields: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.signLeaseAgreementValidator = zod_1.z.object({
    signerType: zod_1.z.enum(['TENANT', 'LANDLORD']),
    signatureData: zod_1.z.string().optional(),
});
exports.executeLeaseAgreementValidator = zod_1.z.object({
    leaseId: zod_1.z.string().uuid("Lease ID must be a valid UUID"),
});
exports.terminateLeaseAgreementValidator = zod_1.z.object({
    leaseId: zod_1.z.string().uuid("Lease ID must be a valid UUID"),
    reason: zod_1.z.string().min(1, "Termination reason is required"),
});
