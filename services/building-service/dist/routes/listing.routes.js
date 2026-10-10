"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listing_controller_1 = require("../controllers/listing.controller");
const router = (0, express_1.Router)();
// Get a specific listing by type and ID
router.route("/:type/:id").get(listing_controller_1.getListing).patch(listing_controller_1.updateListing);
// Get listings with optional filtering
router.route("/").get(listing_controller_1.getListings);
exports.default = router;
