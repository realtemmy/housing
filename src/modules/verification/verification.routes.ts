import { Router } from "express";
import { VerificationController } from "./verification.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth, optionalAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  submitVerificationSchema,
  reviewVerificationSchema,
  reportSuspiciousListingSchema,
  reviewSuspiciousReportSchema,
} from "./verification.validation";

const router = Router();

// Submit verification case (Landlord/Agent/Admin)
router.post(
  "/cases",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(submitVerificationSchema, "body"),
  VerificationController.submitCase
);

// Admin review queue
router.get(
  "/cases",
  requireAuth,
  requireRole(UserRole.ADMIN),
  VerificationController.listCases
);

router.get(
  "/cases/:id",
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.LANDLORD, UserRole.AGENT),
  VerificationController.getCaseById
);

router.patch(
  "/cases/:id/review",
  requireAuth,
  requireRole(UserRole.ADMIN),
  validate(reviewVerificationSchema, "body"),
  VerificationController.reviewCase
);

// Suspicious listings reports (Public/Optional Auth)
router.post(
  "/reports/suspicious",
  optionalAuth,
  validate(reportSuspiciousListingSchema, "body"),
  VerificationController.reportSuspiciousListing
);

router.get(
  "/reports/suspicious",
  requireAuth,
  requireRole(UserRole.ADMIN),
  VerificationController.listSuspiciousReports
);

router.patch(
  "/reports/suspicious/:id",
  requireAuth,
  requireRole(UserRole.ADMIN),
  validate(reviewSuspiciousReportSchema, "body"),
  VerificationController.reviewSuspiciousReport
);

export const verificationRoutes = router;
