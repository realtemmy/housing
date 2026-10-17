import { z } from "zod";
import { PropertyType, InventoryStatus, MediaCategory } from "../../generated/prisma/client";

export const createPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType).default(PropertyType.APARTMENT),
  addressStreet: z.string().min(3, "Street address is required"),
  area: z.string().min(2, "Area is required (e.g., Lekki Phase 1, Yaba, Ikeja)"),
  city: z.string().default("Lagos"),
  state: z.string().default("Lagos"),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const createBuildingSchema = z.object({
  name: z.string().min(1, "Building name is required"),
  description: z.string().optional(),
  floors: z.number().int().positive().optional(),
});

export const updateBuildingSchema = createBuildingSchema.partial();

export const createUnitSchema = z.object({
  buildingId: z.string().uuid().optional(),
  unitNumber: z.string().min(1, "Unit number is required (e.g., Flat 3B)"),
  floor: z.number().int().optional(),
  bedrooms: z.number().int().min(0).default(1),
  bathrooms: z.number().int().min(0).default(1),
  sqft: z.number().int().positive().optional(),
  rentAmount: z.number().positive("Rent amount must be positive"),
  cautionDeposit: z.number().min(0, "Caution deposit must be >= 0"),
  serviceCharge: z.number().min(0).default(0),
  status: z.nativeEnum(InventoryStatus).default(InventoryStatus.AVAILABLE),
});

export const updateUnitSchema = createUnitSchema.partial();

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required (e.g., Room A, Master Bedroom)"),
  type: z.string().optional(),
  size: z.number().int().positive().optional(),
  rentAmount: z.number().positive("Rent amount must be positive"),
  cautionDeposit: z.number().min(0).default(0),
  status: z.nativeEnum(InventoryStatus).default(InventoryStatus.AVAILABLE),
});

export const updateRoomSchema = createRoomSchema.partial();

export const createBedSchema = z.object({
  label: z.string().min(1, "Bed label is required (e.g., Bed 1, Top Bunk)"),
  rentAmount: z.number().positive("Rent amount must be positive"),
  cautionDeposit: z.number().min(0).optional(),
  status: z.nativeEnum(InventoryStatus).default(InventoryStatus.AVAILABLE),
});

export const updateBedSchema = createBedSchema.partial();

export const addMediaSchema = z.object({
  url: z.string().url("Valid URL required"),
  category: z.nativeEnum(MediaCategory).default(MediaCategory.PHOTO),
  caption: z.string().optional(),
  isCover: z.boolean().default(false),
  unitId: z.string().uuid().optional(),
});
