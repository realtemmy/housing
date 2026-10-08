import { Router } from "express";
import {
  processPayment,
  refundPayment,
  getPaymentTransactionById,
  getPaymentsForApplication,
  getPaymentsForReservation,
  getPaymentsForLeasePayment,
} from "../controllers/payment.controller";

const router = Router();

// Payment processing endpoints
router.route("/process").post(processPayment);
router.route("/:id/refund").post(refundPayment);
router.route("/:id").get(getPaymentTransactionById);

// Payment history endpoints
router.route("/application/:applicationId").get(getPaymentsForApplication);
router.route("/reservation/:reservationId").get(getPaymentsForReservation);
router.route("/lease-payment/:leasePaymentId").get(getPaymentsForLeasePayment);

export default router;