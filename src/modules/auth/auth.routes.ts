import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  assignAgentSchema,
} from "./auth.validation";

const router = Router();

// Public auth endpoints
router.post("/register", validate(registerSchema, "body"), AuthController.register);
router.post("/login", validate(loginSchema, "body"), AuthController.login);
router.post("/refresh", validate(refreshTokenSchema, "body"), AuthController.refreshToken);

// Authenticated user endpoints
router.get("/me", requireAuth, AuthController.getProfile);
router.patch("/me", requireAuth, validate(updateProfileSchema, "body"), AuthController.updateProfile);
router.post("/change-password", requireAuth, validate(changePasswordSchema, "body"), AuthController.changePassword);

// Agent delegation (Landlord/Admin can assign agents, Agents can view managed properties)
router.post(
  "/agents/assign",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  validate(assignAgentSchema, "body"),
  AuthController.assignAgent
);
router.get(
  "/agents/managed-properties",
  requireAuth,
  requireRole(UserRole.AGENT, UserRole.ADMIN),
  AuthController.getManagedProperties
);

export const authRoutes = router;
