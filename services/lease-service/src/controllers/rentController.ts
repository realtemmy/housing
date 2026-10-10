import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/appError";
import leaseService from "../services/lease.service";
import {
  createLeaseSchema,
  updateLeaseSchema,
  rentPaymentOptionsSchema,
  generatePaymentScheduleSchema,
  calculateNextDueDateSchema
} from "../validators/rent.validators";

/**
 * Calculate next rent due date for a lease
 */
export const calculateNextDueDate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = calculateNextDueDateSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const { startDate, paymentFrequency, rentDueDay } = value;

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
    await leaseService.applyLateFeesIfApplicable(req.params.leaseId);

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
    const { error, value } = generatePaymentScheduleSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const { startDate, endDate, paymentFrequency, rentDueDay } = value;

    // In a real implementation, we would calculate this based on lease data
    // For now, we'll return a placeholder response
    res.status(200).json({
      status: "success",
      data: {
        message: "Payment schedule generation would be implemented here",
        // In reality, we'd return the actual schedule
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