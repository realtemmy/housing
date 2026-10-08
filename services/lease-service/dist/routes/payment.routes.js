"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
// Payment processing endpoints
router.route("/process").post(payment_controller_1.processPayment);
router.route("/:id/refund").post(payment_controller_1.refundPayment);
router.route("/:id").get(payment_controller_1.getPaymentTransactionById);
// Payment history endpoints
router.route("/application/:applicationId").get(payment_controller_1.getPaymentsForApplication);
router.route("/reservation/:reservationId").get(payment_controller_1.getPaymentsForReservation);
router.route("/lease-payment/:leasePaymentId").get(payment_controller_1.getPaymentsForLeasePayment);
exports.default = router;
