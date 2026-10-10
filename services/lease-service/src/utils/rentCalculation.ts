import { Prisma } from "../generated/prisma/client";

/**
 * Calculate the next due date for rent based on lease start date and payment frequency
 * @param startDate The lease start date or actual move-in date
 * @param paymentFrequency The frequency of payments (MONTHLY, QUARTERLY, YEARLY, BI_ANNUALLY)
 * @param rentDueDay The day of month rent is due (1-31, for monthly frequency)
 * @returns The next due date
 */
export function calculateNextDueDate(
  startDate: Date,
  paymentFrequency: string,
  rentDueDay?: number
): Date {
  const baseDate = new Date(startDate);
  let nextDueDate = new Date(baseDate);

  switch (paymentFrequency) {
    case "MONTHLY":
      // For monthly, we add months until we reach a date that is >= today
      // and adjust to the rent due day
      while (nextDueDate < new Date()) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }
      // Set to the rent due day, or default to 1 if not specified
      const dueDay = rentDueDay ?? 1;
      nextDueDate.setDate(dueDay);
      // If the calculated date is still in the past (e.g., due day has passed this month),
      // add another month
      if (nextDueDate < new Date()) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }
      break;

    case "QUARTERLY":
      // Add 3 months until we reach a date that is >= today
      while (nextDueDate < new Date()) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      }
      break;

    case "YEARLY":
      // Add 1 year until we reach a date that is >= today
      while (nextDueDate < new Date()) {
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      }
      break;

    case "BI_ANNUALLY":
      // Add 6 months until we reach a date that is >= today
      while (nextDueDate < new Date()) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 6);
      }
      break;

    default:
      throw new Error(`Unsupported payment frequency: ${paymentFrequency}`);
  }

  return nextDueDate;
}

/**
 * Check if a payment is late based on due date and grace period
 * @param dueDate The date the payment was due
 * @param gracePeriodDays Number of days after due date before late fee applies
 * @returns True if payment is late, false otherwise
 */
export function isPaymentLate(dueDate: Date, gracePeriodDays: number): boolean {
  const today = new Date();
  const dueDateWithGrace = new Date(dueDate);
  dueDateWithGrace.setDate(dueDate.getDate() + gracePeriodDays);
  return today > dueDateWithGrace;
}

/**
 * Calculate late fee amount based on configuration
 * @param rentAmount The rent amount for the period
 * @param lateFeeAmount Fixed late fee amount (if applicable)
 * @param lateFeePercentage Percentage of rent for late fee (if applicable)
 * @returns The calculated late fee amount
 */
export function calculateLateFee(
  rentAmount: Prisma.Decimal,
  lateFeeAmount: Prisma.Decimal,
  lateFeePercentage: Prisma.Decimal
): Prisma.Decimal {
  // Calculate percentage-based fee
  const percentageFee = rentAmount.times(lateFeePercentage);

  // Return the higher of fixed amount or percentage-based fee
  // This ensures we apply at least some late fee even if percentage is low
  return lateFeeAmount.greaterThan(percentageFee)
    ? lateFeeAmount
    : percentageFee;
}

/**
 * Generate a schedule of all expected payment dates for a lease term
 * @param startDate The lease start date
 * @param endDate The lease end date
 * @param paymentFrequency The frequency of payments
 * @param rentDueDay The day of month rent is due (1-31, for monthly frequency)
 * @returns Array of payment due dates
 */
export function generatePaymentSchedule(
  startDate: Date,
  endDate: Date,
  paymentFrequency: string,
  rentDueDay?: number
): Date[] {
  const schedule: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    let dueDate: Date;

    switch (paymentFrequency) {
      case "MONTHLY":
        dueDate = new Date(currentDate);
        // Set to the rent due day, or default to 1 if not specified
        const dueDay = rentDueDay ?? 1;
        dueDate.setDate(dueDay);
        break;

      case "QUARTERLY":
        dueDate = new Date(currentDate);
        break;

      case "YEARLY":
        dueDate = new Date(currentDate);
        break;

      case "BI_ANNUALLY":
        dueDate = new Date(currentDate);
        break;

      default:
        throw new Error(`Unsupported payment frequency: ${paymentFrequency}`);
    }

    // Only add dates that are within the lease term
    if (dueDate <= endDate) {
      schedule.push(dueDate);
    }

    // Increment the date based on frequency for next iteration
    switch (paymentFrequency) {
      case "MONTHLY":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "QUARTERLY":
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case "YEARLY":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      case "BI_ANNUALLY":
        currentDate.setMonth(currentDate.getMonth() + 6);
        break;
    }
  }

  return schedule;
}

/**
 * Convert PaymentFrequency enum to number of months
 * @param paymentFrequency The payment frequency string
 * @returns Number of months
 */
export function getPaymentFrequencyInMonths(paymentFrequency: string): number {
  switch (paymentFrequency) {
    case "MONTHLY":
      return 1;
    case "QUARTERLY":
      return 3;
    case "YEARLY":
      return 12;
    case "BI_ANNUALLY":
      return 6;
    default:
      throw new Error(`Unsupported payment frequency: ${paymentFrequency}`);
  }
}