import { Router } from "express";
import {
  createProperty,
  getAllProperties,
} from "../controllers/propertyController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

// property/:propertyId/units - Units

router.route("/").get(getAllProperties).post(protect, restrictTo("ADMIN"), createProperty);

export default router;
