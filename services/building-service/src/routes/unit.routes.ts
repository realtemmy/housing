import { Router } from "express";
import {
  createUnit,
  getAllUnits,
  getUnit,
  unitAvailable,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.use(extractUser);

router.route("/:id/available").get(unitAvailable);
router.route("/").get(getAllUnits).post(createUnit);
router.route("/:id").get(getUnit).patch(updateUnit).delete(deleteUnit);

export default router;
