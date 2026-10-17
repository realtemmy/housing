import { Router } from "express";
import { ListingController } from "./listing.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth, optionalAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createListingSchema,
  updateListingSchema,
  createViewingRequestSchema,
  updateViewingRequestSchema,
  createEnquirySchema,
  respondEnquirySchema,
} from "./listing.validation";

const router = Router();

// Public search and viewing
router.get("/search", ListingController.searchListings);
router.get("/my-listings", requireAuth, requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN), ListingController.getMyListings);
router.get("/:id", optionalAuth, ListingController.getListingById);

// Listing Management (Landlord/Agent/Admin)
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createListingSchema, "body"),
  ListingController.createListing
);

router.patch(
  "/:id",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateListingSchema, "body"),
  ListingController.updateListing
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  ListingController.deleteListing
);

// Viewing Requests
router.post(
  "/:listingId/viewings",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(createViewingRequestSchema, "body"),
  ListingController.createViewingRequest
);

router.get("/viewings/all", requireAuth, ListingController.getViewingRequests);

router.patch(
  "/viewings/:viewingId",
  requireAuth,
  validate(updateViewingRequestSchema, "body"),
  ListingController.updateViewingStatus
);

// Enquiries
router.post(
  "/:listingId/enquiries",
  requireAuth,
  requireRole(UserRole.TENANT),
  validate(createEnquirySchema, "body"),
  ListingController.createEnquiry
);

router.get("/enquiries/all", requireAuth, ListingController.getEnquiries);

router.post(
  "/enquiries/:enquiryId/respond",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(respondEnquirySchema, "body"),
  ListingController.respondEnquiry
);

export const listingRoutes = router;
