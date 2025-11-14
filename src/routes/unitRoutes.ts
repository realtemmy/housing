import { Router } from "express";
import {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  getAvailableUnits,
} from "../controllers/unitController";

const router = Router();

router.route("/").get(getAllUnits).post(createUnit);

router.route("/available").get(getAvailableUnits);

router.route("/:id").get(getUnit).patch(updateUnit).delete(deleteUnit);

export default router;
