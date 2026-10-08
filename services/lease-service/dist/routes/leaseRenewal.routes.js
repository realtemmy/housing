"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaseRenewal_controller_1 = require("../controllers/leaseRenewal.controller");
const router = (0, express_1.Router)();
router.route("/").get(leaseRenewal_controller_1.getAllLeaseRenewals).post(leaseRenewal_controller_1.createLeaseRenewal);
router.route("/:id").get(leaseRenewal_controller_1.getLeaseRenewalById).patch(leaseRenewal_controller_1.updateLeaseRenewal).delete(leaseRenewal_controller_1.deleteLeaseRenewal);
exports.default = router;
