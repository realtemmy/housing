"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rentController_1 = require("../controllers/rentController");
const router = (0, express_1.Router)();
// Rent calculation and scheduling endpoints
router.post("/:leaseId/next-due-date", rentController_1.calculateNextDueDate);
router.post("/:leaseId/generate-schedule", rentController_1.generatePaymentSchedule);
// Rent processing endpoints (typically called by scheduled jobs or admin actions)
router.post("/process-recurring", rentController_1.processRecurringRent);
router.post("/:leaseId/apply-late-fees", rentController_1.applyLateFees);
router.post("/:leaseId/update-status-from-payments", rentController_1.updateLeaseStatusFromPayments);
// Configuration endpoints
router.get("/options", rentController_1.getRentPaymentOptions);
exports.default = router;
