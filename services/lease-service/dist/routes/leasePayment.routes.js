"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leasePayment_controller_1 = require("../controllers/leasePayment.controller");
const router = (0, express_1.Router)();
router.route("/").get(leasePayment_controller_1.getAllLeasePayments).post(leasePayment_controller_1.createLeasePayment);
router.route("/:id").get(leasePayment_controller_1.getLeasePaymentById).patch(leasePayment_controller_1.updateLeasePayment).delete(leasePayment_controller_1.deleteLeasePayment);
exports.default = router;
