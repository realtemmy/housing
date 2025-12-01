import { Router } from "express";

import {
  getAllProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controllers/propertyController";
import { extractUser } from "../middlewares/extractUser";

const router = Router();

router.route("/").get(getAllProperties).post(extractUser, createProperty);
router
  .route("/:id")
  .get(getProperty)
  .patch(extractUser, updateProperty)
  .delete(extractUser, deleteProperty);

export default router;
