import { Router } from "express";
import {
  getAllLeasePayments,
  getLeasePaymentById,
  createLeasePayment,
  updateLeasePayment,
  deleteLeasePayment,
} from "../controllers/leasePayment.controller";

const router = Router();

router.route("/").get(getAllLeasePayments).post(createLeasePayment);
router.route("/:id").get(getLeasePaymentById).patch(updateLeasePayment).delete(deleteLeasePayment);

export default router;