import { Router } from "express";
import {
  getAllLeaseRenewals,
  getLeaseRenewalById,
  createLeaseRenewal,
  updateLeaseRenewal,
  deleteLeaseRenewal,
} from "../controllers/leaseRenewal.controller";

const router = Router();

router.route("/").get(getAllLeaseRenewals).post(createLeaseRenewal);
router.route("/:id").get(getLeaseRenewalById).patch(updateLeaseRenewal).delete(deleteLeaseRenewal);

export default router;