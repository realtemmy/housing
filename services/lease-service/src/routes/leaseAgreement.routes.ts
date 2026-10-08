import { Router } from "express";
import {
  generateLeaseAgreement,
  signLeaseAgreement,
  getLeaseAgreement,
  executeLeaseAgreement,
  terminateLeaseAgreement,
} from "../controllers/leaseAgreement.controller";

const router = Router();

// Lease agreement generation and management
router.route("/:leaseId/generate").post(generateLeaseAgreement);
router.route("/:leaseId/sign").post(signLeaseAgreement);
router.route("/:leaseId").get(getLeaseAgreement);
router.route("/:leaseId/execute").post(executeLeaseAgreement);
router.route("/:leaseId/terminate").post(terminateLeaseAgreement);

export default router;