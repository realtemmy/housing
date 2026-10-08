import { Router } from "express";
import {
  getAllApplications,
  getApplicationById,
  getApplicationsByApplicant,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller";

const router = Router();

// General applications endpoints
router.route("/").get(getAllApplications).post(createApplication);

// Application by ID
router.route("/:id").get(getApplicationById).patch(updateApplication).delete(deleteApplication);

// Applications by applicant
router.route("/applicant/:id").get(getApplicationsByApplicant);

export default router;