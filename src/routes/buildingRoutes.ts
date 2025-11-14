import { Router } from "express";
import {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingController";

const router = Router();

router.route("/").get(getAllBuildings).post(createBuilding);

router
  .route("/:id")
  .get(getBuilding)
  .patch(updateBuilding)
  .delete(deleteBuilding);

export default router;
