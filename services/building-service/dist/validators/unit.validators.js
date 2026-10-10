"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitValidator = exports.unitValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.unitValidator = zod_1.z.object({
    unitNumber: zod_1.z.string().min(1, "Unit number is required"),
    floor: zod_1.z.number().int().optional(),
    bedrooms: zod_1.z
        .number()
        .int()
        .nonnegative("Bedrooms must be a non-negative integer")
        .optional(),
    bathrooms: zod_1.z
        .number()
        .nonnegative("Bathrooms must be a non-negative number")
        .optional(),
    sqft: zod_1.z
        .number()
        .int()
        .positive("Square footage must be a positive integer")
        .optional(),
    type: zod_1.z.nativeEnum(client_1.UnitType).optional().default("APARTMENT"),
    status: zod_1.z
        .enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
        .default("AVAILABLE"),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional(),
    buildingId: zod_1.z.string().min(1, "Building ID is required").optional(),
    propertyId: zod_1.z.string().min(1, "Property ID is required").optional(),
    occupantId: zod_1.z.string().optional(),
});
exports.updateUnitValidator = zod_1.z.object({
    unitNumber: zod_1.z.string().min(1, "Unit number must not be empty").optional(),
    floor: zod_1.z.number().int().optional(),
    bedrooms: zod_1.z
        .number()
        .int()
        .nonnegative("Bedrooms must be a non-negative integer")
        .optional(),
    bathrooms: zod_1.z
        .number()
        .nonnegative("Bathrooms must be a non-negative number")
        .optional(),
    sqft: zod_1.z
        .number()
        .int()
        .positive("Square footage must be a positive integer")
        .optional(),
    type: zod_1.z.nativeEnum(client_1.UnitType).optional(),
    status: zod_1.z
        .enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
        .optional(),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional(),
    buildingId: zod_1.z.string().optional(),
    propertyId: zod_1.z.string().optional(),
    occupantId: zod_1.z.string().optional(),
    verified: zod_1.z.boolean().optional(),
});
