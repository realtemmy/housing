"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lease_controller_1 = require("../controllers/lease.controller");
const router = (0, express_1.Router)();
router.route("/").get(lease_controller_1.getAllLeases).post(lease_controller_1.createLease);
router.route("/:id").get(lease_controller_1.getLeaseById).patch(lease_controller_1.updateLease);
exports.default = router;
