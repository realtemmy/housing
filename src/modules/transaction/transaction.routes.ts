import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createApplicationSchema,
  reviewApplicationSchema,
  createOfferSchema,
  respondOfferSchema,
  createReservationHoldSchema,
} from "./transaction.validation";

const router = Router();

// Applications
router.post(
  "/applications",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(createApplicationSchema, "body"),
  TransactionController.createApplication
);

router.get("/applications", requireAuth, TransactionController.listApplications);
router.get("/applications/:id", requireAuth, TransactionController.getApplicationById);

router.patch(
  "/applications/:id/review",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(reviewApplicationSchema, "body"),
  TransactionController.reviewApplication
);

// Offers
router.post(
  "/offers",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createOfferSchema, "body"),
  TransactionController.createOffer
);

router.post(
  "/offers/:offerId/respond",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(respondOfferSchema, "body"),
  TransactionController.respondOffer
);

// Reservation Holds (Double-booking protected)
router.post(
  "/reservations",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(createReservationHoldSchema, "body"),
  TransactionController.createReservationHold
);

router.get("/reservations/:id", requireAuth, TransactionController.getReservation);

router.post(
  "/reservations/:id/cancel",
  requireAuth,
  TransactionController.cancelReservationHold
);

export const transactionRoutes = router;
