import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getProperty,
} from "../controllers/propertyController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

// property/:propertyId/units - Units

router
  .route("/")
  .get(getAllProperties)
  .post(protect, restrictTo("ADMIN"), createProperty);

router
  .route("/:id")
  .get(getProperty)
  .delete(protect, restrictTo("ADMIN"), deleteProperty);

export default router;
