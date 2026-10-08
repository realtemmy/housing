import { Router } from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
  restoreBuilding,
} from "../controllers/building.controller";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.use(extractUser);

router.route("/").get(getAllBuildings).post(createBuilding);
router.route("/:id").get(getBuilding).patch(updateBuilding).delete(deleteBuilding);
router.route("/:id/restore").patch(restoreBuilding);

export default router;