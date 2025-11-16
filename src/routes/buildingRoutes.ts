import { Router } from "express";
import {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingController";

const router = Router();

// building/:buildingId/units - Units

router.route("/").get(getAllBuildings).post(createBuilding);

router
  .route("/:id")
  .get(getBuilding)
  .patch(updateBuilding)
  .delete(deleteBuilding);

export default router;
