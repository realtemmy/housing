import { Router } from "express";
import {
  getListing,
  updateListing,
  getListings,
} from "../controllers/listing.controller";

const router = Router();

// Get a specific listing by type and ID
router.route("/:type/:id").get(getListing).patch(updateListing);

// Get listings with optional filtering
router.route("/").get(getListings);

export default router;