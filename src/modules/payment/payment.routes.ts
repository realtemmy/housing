import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createPaymentInstructionSchema,
  reportPaymentSchema,
  verifyPaymentSchema,
  correctPaymentSchema,
  createRentObligationSchema,
} from "./payment.validation";

const router = Router();

// Payment Instructions (Landlord/Agent sets bank details, Tenant views them)
router.post(
  "/instructions",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createPaymentInstructionSchema, "body"),
  PaymentController.setPaymentInstruction
);

router.get("/instructions/:tenancyId", requireAuth, PaymentController.getPaymentInstructions);

// Obligations
router.post(
  "/obligations",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createRentObligationSchema, "body"),
  PaymentController.createObligation
);

// Tenant-Reported Payments
router.post(
  "/records",
  requireAuth,
  validate(reportPaymentSchema, "body"),
  PaymentController.reportPayment
);

// Payment Verification (Landlord/Agent confirms receipt in bank account)
router.patch(
  "/records/:id/verify",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(verifyPaymentSchema, "body"),
  PaymentController.verifyPayment
);

// Payment Corrections (Audited adjustments)
router.post(
  "/records/:id/correct",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(correctPaymentSchema, "body"),
  PaymentController.correctPayment
);

// Statement of Account / Tenancy Ledger
router.get("/ledger/:tenancyId", requireAuth, PaymentController.getTenancyLedger);

export const paymentRoutes = router;
