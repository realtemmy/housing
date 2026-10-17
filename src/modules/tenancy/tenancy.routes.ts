import { Router } from "express";
import { TenancyController } from "./tenancy.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createTenancySchema,
  updateTenancySchema,
  addOccupantSchema,
  createAgreementSchema,
  signAgreementSchema,
} from "./tenancy.validation";

const router = Router();

// Tenancies
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createTenancySchema, "body"),
  TenancyController.createTenancy
);

router.get("/", requireAuth, TenancyController.listTenancies);
router.get("/:id", requireAuth, TenancyController.getTenancyById);

router.patch(
  "/:id",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateTenancySchema, "body"),
  TenancyController.updateTenancy
);

// Occupants
router.post(
  "/:tenancyId/occupants",
  requireAuth,
  validate(addOccupantSchema, "body"),
  TenancyController.addOccupant
);

router.delete(
  "/:tenancyId/occupants/:occupantId",
  requireAuth,
  TenancyController.removeOccupant
);

// Digital Agreements
router.post(
  "/:tenancyId/agreements",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createAgreementSchema, "body"),
  TenancyController.createAgreement
);

router.post(
  "/agreements/:agreementId/sign/tenant",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(signAgreementSchema, "body"),
  TenancyController.signAgreementTenant
);

router.post(
  "/agreements/:agreementId/sign/landlord",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(signAgreementSchema, "body"),
  TenancyController.signAgreementLandlord
);

export const tenancyRoutes = router;
