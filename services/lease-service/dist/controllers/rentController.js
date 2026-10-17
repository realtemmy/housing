"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRentPaymentOptions = exports.generatePaymentSchedule = exports.updateLeaseStatusFromPayments = exports.applyLateFees = exports.processRecurringRent = exports.calculateNextDueDate = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const appError_1 = __importDefault(require("../utils/appError"));
const lease_service_1 = __importDefault(require("../services/lease.service"));
const rent_validators_1 = require("../validators/rent.validators");
/**
 * Calculate next rent due date for a lease
 */
exports.calculateNextDueDate = (0, asyncHandler_1.default)(async (req, res, next) => {
    const nextDueDate = await lease_service_1.default.calculateNextRentDueDate(req.params.leaseId);
    if (!nextDueDate) {
        return next(new appError_1.default("Unable to calculate next due date", 400));
    }
    res.status(200).json({
        status: "success",
        data: {
            nextDueDate
        }
    });
});
/**
 * Process recurring rent for all leases (typically called by scheduled job)
 */
exports.processRecurringRent = (0, asyncHandler_1.default)(async (_req, res, next) => {
    await lease_service_1.default.processRecurringRent();
    res.status(200).json({
        status: "success",
        message: "Recurring rent processing completed"
    });
});
/**
 * Apply late fees to overdue payments for a specific lease
 */
exports.applyLateFees = (0, asyncHandler_1.default)(async (req, res, next) => {
    const lease = await lease_service_1.default.getLeaseById(req.params.leaseId);
    await lease_service_1.default.applyLateFeesIfApplicable(lease);
    res.status(200).json({
        status: "success",
        message: "Late fees applied successfully"
    });
});
/**
 * Update lease status based on payment history
 */
exports.updateLeaseStatusFromPayments = (0, asyncHandler_1.default)(async (req, res, next) => {
    await lease_service_1.default.updateLeaseStatusFromPayments(req.params.leaseId);
    res.status(200).json({
        status: "success",
        message: "Lease status updated successfully"
    });
});
/**
 * Generate payment schedule for a lease
 */
exports.generatePaymentSchedule = (0, asyncHandler_1.default)(async (req, res, next) => {
    const result = rent_validators_1.generatePaymentScheduleSchema.safeParse(req.body);
    if (!result.success) {
        return next(new appError_1.default(result.error.issues[0].message, 400));
    }
    const { startDate, endDate, paymentFrequency, rentDueDay } = result.data;
    // Import the utility function
    const { generatePaymentSchedule: generateSchedule } = require("../utils/rentCalculation");
    // Generate the payment schedule
    const schedule = generateSchedule(new Date(startDate), new Date(endDate), paymentFrequency, rentDueDay);
    res.status(200).json({
        status: "success",
        data: {
            schedule
        }
    });
});
/**
 * Get rent payment options for processing
 */
exports.getRentPaymentOptions = (0, asyncHandler_1.default)(async (_req, res, next) => {
    const defaultOptions = rent_validators_1.rentPaymentOptionsSchema.parse({
        applyLateFees: true,
        sendNotifications: true,
        updateLeaseStatus: true
    });
    res.status(200).json({
        status: "success",
        data: {
            options: defaultOptions
        }
    });
});
