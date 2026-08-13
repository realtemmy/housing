import { Router } from "express";
import {
  getAllProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controllers/property.controller";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.use(extractUser);

router.route("/").get(getAllProperties).post(createProperty);
router.route("/:id").get(getProperty).patch(updateProperty).delete(deleteProperty);

export default router;
