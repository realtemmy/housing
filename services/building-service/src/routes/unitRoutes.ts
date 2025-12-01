import { Router } from "express";
import {
  createUnit,
  getAllUnits,
  getUnit,
  unitAvailable,
  updateUnit,
} from "../controllers/unitController";

const router = Router();

router.route("/:id/available").get(unitAvailable);
router.route("/").get(getAllUnits).post(createUnit);
router.route("/:id").get(getUnit).patch(updateUnit);

export default router;
