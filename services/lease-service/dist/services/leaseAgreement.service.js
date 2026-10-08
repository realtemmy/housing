"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaseAgreementService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class LeaseAgreementService {
    // Generate a lease agreement document
    async generateLeaseAgreement(input) {
        // Validate lease exists
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: input.leaseId },
            include: {
                tenant: true,
            },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        // Validate lease is in appropriate state for agreement generation
        if (lease.status !== 'PENDING' && lease.status !== 'ACTIVE') {
            throw new appError_1.default("Lease agreement can only be generated for PENDING or ACTIVE leases", 400);
        }
        // In a real implementation, we would:
        // 1. Use a document template (HTML/PDF)
        // 2. Populate with lease data, tenant data, property data
        // 3. Generate PDF document
        // 4. Store in cloud storage (S3, etc.) and get URL
        // 5. Generate signing URL if needed
        // For now, we'll simulate document generation
        const agreementHash = this.generateHash(lease.id + Date.now().toString());
        const agreementUrl = `/uploads/agreements/${lease.id}_agreement.pdf`; // Simulated URL
        const signingUrl = `/sign/${lease.id}?token=${this.generateHash(lease.id)}`; // Simulated signing URL
        // Update lease with agreement information
        const updatedLease = await prisma_1.prisma.lease.update({
            where: { id: input.leaseId },
            data: {
                agreementStatus: 'PENDING_SIGNATURE',
                agreementUrl,
                agreementHash,
                signingUrl,
                signingExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
            },
        });
        return {
            success: true,
            leaseId: updatedLease.id,
            agreementStatus: updatedLease.agreementStatus,
            agreementUrl: updatedLease.agreementUrl,
            signingUrl: updatedLease.signingUrl,
            message: "Lease agreement generated successfully",
        };
    }
    // Sign a lease agreement (tenant or landlord)
    async signLeaseAgreement(input) {
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: input.leaseId },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        if (lease.agreementStatus !== 'PENDING_SIGNATURE' && lease.agreementStatus !== 'SIGNED') {
            throw new appError_1.default("Lease agreement is not available for signing", 400);
        }
        // Check if signing link has expired
        if (lease.signingExpiresAt && lease.signingExpiresAt < new Date()) {
            throw new appError_1.default("Lease agreement signing link has expired", 400);
        }
        let updateData = {};
        let isFullySigned = false;
        if (input.signerType === 'TENANT') {
            updateData = {
                signedByTenant: true,
                tenantSignedAt: new Date(),
            };
            // Check if landlord also signed
            if (lease.signedByLandlord) {
                isFullySigned = true;
                updateData.agreementStatus = 'SIGNED';
                updateData.signedAt = new Date();
            }
        }
        else if (input.signerType === 'LANDLORD') {
            updateData = {
                signedByLandlord: true,
                landlordSignedAt: new Date(),
            };
            // Check if tenant also signed
            if (lease.signedByTenant) {
                isFullySigned = true;
                updateData.agreementStatus = 'SIGNED';
                updateData.signedAt = new Date();
            }
        }
        // If fully signed, clear the signing URL as it's no longer needed
        if (isFullySigned) {
            updateData.signingUrl = null;
            updateData.signingExpiresAt = null;
        }
        const updatedLease = await prisma_1.prisma.lease.update({
            where: { id: input.leaseId },
            data: updateData,
        });
        return {
            success: true,
            leaseId: updatedLease.id,
            agreementStatus: updatedLease.agreementStatus,
            agreementUrl: updatedLease.agreementUrl,
            signingUrl: updatedLease.signingUrl,
            message: input.signerType === 'TENANT'
                ? "Tenant signed the lease agreement successfully"
                : "Landlord signed the lease agreement successfully",
        };
    }
    // Get lease agreement details
    async getLeaseAgreement(leaseId) {
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: leaseId },
            select: {
                id: true,
                agreementStatus: true,
                agreementUrl: true,
                agreementHash: true,
                signedAt: true,
                signedByTenant: true,
                signedByLandlord: true,
                tenantSignedAt: true,
                landlordSignedAt: true,
                signingUrl: true,
                signingExpiresAt: true,
                updatedAt: true,
            },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        return lease;
    }
    // Mark lease agreement as executed (when both parties have signed and it's legally binding)
    async executeLeaseAgreement(leaseId) {
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: leaseId },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        if (!(lease.signedByTenant && lease.signedByLandlord)) {
            throw new appError_1.default("Both tenant and landlord must sign before executing the agreement", 400);
        }
        if (lease.agreementStatus === 'EXECUTED') {
            throw new appError_1.default("Lease agreement is already executed", 400);
        }
        const updatedLease = await prisma_1.prisma.lease.update({
            where: { id: leaseId },
            data: {
                agreementStatus: 'EXECUTED',
                // If not already set, set the signedAt timestamp
                ...(!lease.signedAt ? { signedAt: new Date() } : {}),
            },
        });
        return {
            success: true,
            leaseId: updatedLease.id,
            agreementStatus: updatedLease.agreementStatus,
            agreementUrl: updatedLease.agreementUrl,
            signingUrl: updatedLease.signingUrl,
            message: "Lease agreement executed successfully",
        };
    }
    // Terminate lease agreement
    async terminateLeaseAgreement(leaseId, reason) {
        const lease = await prisma_1.prisma.lease.findUnique({
            where: { id: leaseId },
        });
        if (!lease) {
            throw new appError_1.default("Lease not found", 404);
        }
        const updatedLease = await prisma_1.prisma.lease.update({
            where: { id: leaseId },
            data: {
                agreementStatus: 'TERMINATED',
                terminationReason: reason,
                terminationDate: new Date(),
            },
        });
        return {
            success: true,
            leaseId: updatedLease.id,
            agreementStatus: updatedLease.agreementStatus,
            agreementUrl: updatedLease.agreementUrl,
            signingUrl: updatedLease.signingUrl,
            message: "Lease agreement terminated successfully",
        };
    }
    // Helper method to generate a hash (simplified for simulation)
    generateHash(input) {
        // In a real implementation, use crypto.createHash('sha256').update(input).digest('hex')
        return Array.from(input).reduce((hash, char) => {
            return char.charCodeAt(0) + ((hash << 5) - hash);
        }, 0).toString(36);
    }
}
exports.LeaseAgreementService = LeaseAgreementService;
exports.default = new LeaseAgreementService();
