"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
class ApplicationService {
    async getAllApplications(options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;
        // Build where clause
        const whereClause = {
            ...(options.applicantId && { applicantId: options.applicantId }),
            ...(options.status && { status: options.status }),
            ...(options.applicationType && {
                [`${options.applicationType}Id`]: options.applicationId
            }),
        };
        // Handle applicationType filter
        if (options.applicationType && options.applicationId) {
            const typeField = `${options.applicationType}Id`;
            whereClause[typeField] = options.applicationId;
        }
        const [totalItems, applications] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.application.count({ where: whereClause }),
            prisma_1.prisma.application.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: {
                // We could include related data here if needed, but keeping it simple for now
                },
                orderBy: { submittedAt: 'desc' },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items: applications,
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
        };
    }
    async getApplicationById(id) {
        const application = await prisma_1.prisma.application.findUnique({
            where: { id },
        });
        if (!application) {
            throw new appError_1.default("Application not found", 404);
        }
        return application;
    }
    async getApplicationsByApplicant(applicantId, options = {}) {
        return this.getAllApplications({
            ...options,
            applicantId,
        });
    }
    async createApplication(input) {
        // Verify applicant exists (basic check - in reality we'd check auth service)
        // For now, we'll just proceed and let foreign key issues surface as errors
        // Verify the target property/unit/room/bed exists
        let targetExists = false;
        if (input.applicationType === 'property' && input.applicationId) {
            const property = await prisma_1.prisma.property.findUnique({
                where: { id: input.applicationId },
            });
            targetExists = !!property;
        }
        else if (input.applicationType === 'unit' && input.applicationId) {
            const unit = await prisma_1.prisma.unit.findUnique({
                where: { id: input.applicationId },
            });
            targetExists = !!unit;
        }
        else if (input.applicationType === 'room' && input.applicationId) {
            const room = await prisma_1.prisma.room.findUnique({
                where: { id: input.applicationId },
            });
            targetExists = !!room;
        }
        else if (input.applicationType === 'bed' && input.applicationId) {
            const bed = await prisma_1.prisma.bed.findUnique({
                where: { id: input.applicationId },
            });
            targetExists = !!bed;
        }
        if (!targetExists) {
            throw new appError_1.default("Target property/unit/room/bed not found", 404);
        }
        const application = await prisma_1.prisma.application.create({
            data: {
                applicantId: input.applicantId,
                ...(input.applicationType === 'property' && { propertyId: input.applicationId }),
                ...(input.applicationType === 'unit' && { unitId: input.applicationId }),
                ...(input.applicationType === 'room' && { roomId: input.applicationId }),
                ...(input.applicationType === 'bed' && { bedId: input.applicationId }),
                coverLetter: input.coverLetter ?? null,
                desiredMoveInDate: input.desiredMoveInDate
                    ? typeof input.desiredMoveInDate === 'string'
                        ? new Date(input.desiredMoveInDate)
                        : input.desiredMoveInDate
                    : undefined,
                applicationFee: input.applicationFee !== undefined
                    ? new client_1.Prisma.Decimal(input.applicationFee.toString())
                    : undefined,
                answers: input.answers ?? null,
                submittedAt: new Date(), // Set submitted timestamp
            },
        });
        return application;
    }
    async updateApplication(id, input) {
        const existingApplication = await prisma_1.prisma.application.findUnique({
            where: { id },
        });
        if (!existingApplication) {
            throw new appError_1.default("Application not found", 404);
        }
        const application = await prisma_1.prisma.application.update({
            where: { id },
            data: {
                ...(input.coverLetter !== undefined && { coverLetter: input.coverLetter }),
                ...(input.desiredMoveInDate !== undefined && {
                    desiredMoveInDate: input.desiredMoveInDate === null
                        ? null
                        : typeof input.desiredMoveInDate === 'string'
                            ? new Date(input.desiredMoveInDate)
                            : input.desiredMoveInDate
                }),
                ...(input.applicationFee !== undefined && {
                    applicationFee: input.applicationFee === null
                        ? null
                        : new client_1.Prisma.Decimal(input.applicationFee.toString())
                }),
                ...(input.answers !== undefined && { answers: input.answers }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.reviewedAt !== undefined && {
                    reviewedAt: input.reviewedAt === null
                        ? null
                        : typeof input.reviewedAt === 'string'
                            ? new Date(input.reviewedAt)
                            : input.reviewedAt
                }),
                ...(input.reviewedBy !== undefined && { reviewedBy: input.reviewedBy }),
                ...(input.applicationFeePaid !== undefined && { applicationFeePaid: input.applicationFeePaid }),
                ...(input.adminNotes !== undefined && { adminNotes: input.adminNotes }),
                updatedAt: new Date(),
            },
        });
        return application;
    }
    async deleteApplication(id) {
        const application = await prisma_1.prisma.application.findUnique({
            where: { id },
        });
        if (!application) {
            throw new appError_1.default("Application not found", 404);
        }
        await prisma_1.prisma.application.delete({
            where: { id },
        });
        return { id };
    }
}
exports.ApplicationService = ApplicationService;
exports.default = new ApplicationService();
