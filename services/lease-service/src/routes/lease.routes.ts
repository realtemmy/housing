import { Router } from "express";
import {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
} from "../controllers/lease.controller";

const router = Router();

router.route("/").get(getAllLeases).post(createLease);
router.route("/:id").get(getLeaseById).patch(updateLease);

export default router;