import { Router } from "express";
import {
  createProperty,
  getAllProperties,
} from "../controllers/propertyController";

const router = Router();

// property/:propertyId/units - Units

router.route("/").get(getAllProperties).post(createProperty);

export default router;
