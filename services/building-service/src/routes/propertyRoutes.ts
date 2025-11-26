import { Router } from "express";

import {
  getAllProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controllers/propertyController";

const router = Router();

router.route("/").get(getAllProperties).post(createProperty);

router
  .route("/:id")
  .get(getProperty)
  .patch(updateProperty)
  .delete(deleteProperty);

export default router;
