import { Router } from "express";
import { PropertyController } from "./property.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth, optionalAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { UserRole } from "../../generated/prisma/client";
import {
  createPropertySchema,
  updatePropertySchema,
  createBuildingSchema,
  updateBuildingSchema,
  createUnitSchema,
  updateUnitSchema,
  createRoomSchema,
  updateRoomSchema,
  createBedSchema,
  updateBedSchema,
  addMediaSchema,
} from "./property.validation";

const router = Router();

// Availability check (Public/Optional auth)
router.get("/availability/:type/:id", PropertyController.checkAvailability);

// Property CRUD
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createPropertySchema, "body"),
  PropertyController.createProperty
);

router.get("/", optionalAuth, PropertyController.listProperties);
router.get("/:id", optionalAuth, PropertyController.getPropertyById);

router.patch(
  "/:id",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updatePropertySchema, "body"),
  PropertyController.updateProperty
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteProperty
);

// Buildings
router.post(
  "/:propertyId/buildings",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createBuildingSchema, "body"),
  PropertyController.createBuilding
);

router.patch(
  "/buildings/:buildingId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateBuildingSchema, "body"),
  PropertyController.updateBuilding
);

router.delete(
  "/buildings/:buildingId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteBuilding
);

// Units
router.post(
  "/:propertyId/units",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createUnitSchema, "body"),
  PropertyController.createUnit
);

router.patch(
  "/units/:unitId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateUnitSchema, "body"),
  PropertyController.updateUnit
);

router.delete(
  "/units/:unitId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteUnit
);

// Rooms
router.post(
  "/:propertyId/units/:unitId/rooms",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createRoomSchema, "body"),
  PropertyController.createRoom
);

router.patch(
  "/rooms/:roomId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateRoomSchema, "body"),
  PropertyController.updateRoom
);

router.delete(
  "/rooms/:roomId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteRoom
);

// Beds
router.post(
  "/:propertyId/rooms/:roomId/beds",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(createBedSchema, "body"),
  PropertyController.createBed
);

router.patch(
  "/beds/:bedId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(updateBedSchema, "body"),
  PropertyController.updateBed
);

router.delete(
  "/beds/:bedId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteBed
);

// Media
router.post(
  "/:propertyId/media",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  validate(addMediaSchema, "body"),
  PropertyController.addMedia
);

router.delete(
  "/media/:mediaId",
  requireAuth,
  requireRole(UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN),
  PropertyController.removeMedia
);

export const propertyRoutes = router;
