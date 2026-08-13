import { Router } from "express";
import {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
} from "../controllers/bed.controller";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.use(extractUser);

router.route("/").get(getAllBeds).post(createBed);
router.route("/:id").get(getBedById).patch(updateBed).delete(deleteBed);

export default router;
