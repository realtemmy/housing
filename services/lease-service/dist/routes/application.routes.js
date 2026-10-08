"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();
// General applications endpoints
router.route("/").get(application_controller_1.getAllApplications).post(application_controller_1.createApplication);
// Application by ID
router.route("/:id").get(application_controller_1.getApplicationById).patch(application_controller_1.updateApplication).delete(application_controller_1.deleteApplication);
// Applications by applicant
router.route("/applicant/:id").get(application_controller_1.getApplicationsByApplicant);
exports.default = router;
