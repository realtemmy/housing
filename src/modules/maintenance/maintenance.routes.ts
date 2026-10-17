import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createMaintenanceSchema,
  updateMaintenanceStatusSchema,
  addMaintenanceCommentSchema,
} from "./maintenance.validation";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(createMaintenanceSchema, "body"),
  MaintenanceController.createRequest
);

router.get("/", requireAuth, MaintenanceController.listRequests);
router.get("/:id", requireAuth, MaintenanceController.getRequestById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateMaintenanceStatusSchema, "body"),
  MaintenanceController.updateStatus
);

router.post(
  "/:id/comments",
  requireAuth,
  validate(addMaintenanceCommentSchema, "body"),
  MaintenanceController.addComment
);

export const maintenanceRoutes = router;
