import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/appError";
import leaseService from "../services/lease.service";
import {
  createLeaseSchema,
  updateLeaseSchema,
  rentPaymentOptionsSchema,
  generatePaymentScheduleSchema
} from "../validators/rent.validators";

/**
 * Calculate next rent due date for a lease
 */
export const calculateNextDueDate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const nextDueDate = await leaseService.calculateNextRentDueDate(
      req.params.leaseId
    );

    if (!nextDueDate) {
      return next(new AppError("Unable to calculate next due date", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        nextDueDate
      }
    });
  }
);

/**
 * Process recurring rent for all leases (typically called by scheduled job)
 */
export const processRecurringRent = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    await leaseService.processRecurringRent();

    res.status(200).json({
      status: "success",
      message: "Recurring rent processing completed"
    });
  }
);

/**
 * Apply late fees to overdue payments for a specific lease
 */
export const applyLateFees = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const lease = await leaseService.getLeaseById(req.params.leaseId);
    await leaseService.applyLateFeesIfApplicable(lease);

    res.status(200).json({
      status: "success",
      message: "Late fees applied successfully"
    });
  }
);

/**
 * Update lease status based on payment history
 */
export const updateLeaseStatusFromPayments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await leaseService.updateLeaseStatusFromPayments(req.params.leaseId);

    res.status(200).json({
      status: "success",
      message: "Lease status updated successfully"
    });
  }
);

/**
 * Generate payment schedule for a lease
 */
export const generatePaymentSchedule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = generatePaymentScheduleSchema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(result.error.issues[0].message, 400));
    }

    const { startDate, endDate, paymentFrequency, rentDueDay } = result.data;

    // Import the utility function
    const { generatePaymentSchedule: generateSchedule } = require("../utils/rentCalculation");

    // Generate the payment schedule
    const schedule = generateSchedule(
      new Date(startDate),
      new Date(endDate),
      paymentFrequency,
      rentDueDay
    );

    res.status(200).json({
      status: "success",
      data: {
        schedule
      }
    });
  }
);

/**
 * Get rent payment options for processing
 */
export const getRentPaymentOptions = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const defaultOptions = rentPaymentOptionsSchema.parse({
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
  }
);