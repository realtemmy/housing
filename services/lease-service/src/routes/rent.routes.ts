import { Router } from "express";
import {
  calculateNextDueDate,
  processRecurringRent,
  applyLateFees,
  updateLeaseStatusFromPayments,
  generatePaymentSchedule,
  getRentPaymentOptions
} from "../controllers/rentController";

const router = Router();

// Rent calculation and scheduling endpoints
router.post(
  "/:leaseId/next-due-date",
  calculateNextDueDate
);

router.post(
  "/:leaseId/generate-schedule",
  generatePaymentSchedule
);

// Rent processing endpoints (typically called by scheduled jobs or admin actions)
router.post(
  "/process-recurring",
  processRecurringRent
);

router.post(
  "/:leaseId/apply-late-fees",
  applyLateFees
);

router.post(
  "/:leaseId/update-status-from-payments",
  updateLeaseStatusFromPayments
);

// Configuration endpoints
router.get(
  "/options",
  getRentPaymentOptions
);

export default router;