import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";

const router = Router();

// Tenant Dashboard
router.get(
  "/tenant",
  requireAuth,
  requireRole(UserRole.TENANT),
  DashboardController.getTenantDashboard
);

// Landlord / Agent Dashboard
router.get(
  "/owner",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  DashboardController.getOwnerDashboard
);

// Admin Dashboard
router.get(
  "/admin",
  requireAuth,
  requireRole(UserRole.ADMIN),
  DashboardController.getAdminDashboard
);

// Admin Audit Logs
router.get(
  "/admin/audit-logs",
  requireAuth,
  requireRole(UserRole.ADMIN),
  DashboardController.listAuditLogs
);

export const dashboardRoutes = router;
