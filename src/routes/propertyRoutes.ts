import { Router } from "express";
import {
  createProperty,
  getAllProperties,
} from "../controllers/propertyController";

const router = Router();

router.route("/").get(getAllProperties).post(createProperty);

export default router;
