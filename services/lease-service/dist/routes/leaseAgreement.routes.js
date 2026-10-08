"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaseAgreement_controller_1 = require("../controllers/leaseAgreement.controller");
const router = (0, express_1.Router)();
// Lease agreement generation and management
router.route("/:leaseId/generate").post(leaseAgreement_controller_1.generateLeaseAgreement);
router.route("/:leaseId/sign").post(leaseAgreement_controller_1.signLeaseAgreement);
router.route("/:leaseId").get(leaseAgreement_controller_1.getLeaseAgreement);
router.route("/:leaseId/execute").post(leaseAgreement_controller_1.executeLeaseAgreement);
router.route("/:leaseId/terminate").post(leaseAgreement_controller_1.terminateLeaseAgreement);
exports.default = router;
