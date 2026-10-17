import { Router } from "express";
import { HandoverController } from "./handover.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createHandoverSchema,
  updateHandoverChecklistSchema,
  completeHandoverOtpSchema,
} from "./handover.validation";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createHandoverSchema, "body"),
  HandoverController.createHandover
);

router.get("/:id", requireAuth, HandoverController.getHandover);

router.patch(
  "/:id/checklist",
  requireAuth,
  validate(updateHandoverChecklistSchema, "body"),
  HandoverController.updateChecklist
);

router.post(
  "/:id/confirm/landlord",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  HandoverController.confirmLandlord
);

// Physical OTP verification (dual completion)
router.post(
  "/:id/complete",
  requireAuth,
  validate(completeHandoverOtpSchema, "body"),
  HandoverController.completeWithOtp
);

export const handoverRoutes = router;
