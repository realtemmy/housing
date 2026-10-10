"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertyValidator = exports.propertyValidator = void 0;
const zod_1 = require("zod");
exports.propertyValidator = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
    description: zod_1.z
        .string()
        .max(1000, "Description should not exceed 1000 characters")
        .optional()
        .nullable(),
    address: zod_1.z.object({
        street: zod_1.z.string().min(1, "Street is required"),
        city: zod_1.z.string().min(1, "City is required"),
        state: zod_1.z.string().min(1, "State is required"),
        postalCode: zod_1.z.string().min(1, "Postal code is required"),
        country: zod_1.z.string().min(1, "Country is required"),
        longitude: zod_1.z.number().optional(),
        latitude: zod_1.z.number().optional(),
    }).optional(),
    purchasePrice: zod_1.z.number().min(0, "Purchase price must be positive").optional(),
    currentValue: zod_1.z.number().min(0, "Current value must be positive").optional(),
});
exports.updatePropertyValidator = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title must not be empty").max(200, "Title must not exceed 200 characters").optional(),
    description: zod_1.z
        .string()
        .max(1000, "Description should not exceed 1000 characters")
        .optional()
        .nullable(),
    address: zod_1.z.object({
        street: zod_1.z.string().min(1, "Street is required"),
        city: zod_1.z.string().min(1, "City is required"),
        state: zod_1.z.string().min(1, "State is required"),
        postalCode: zod_1.z.string().min(1, "Postal code is required"),
        country: zod_1.z.string().min(1, "Country is required"),
        longitude: zod_1.z.number().optional(),
        latitude: zod_1.z.number().optional(),
    }).optional(),
    purchasePrice: zod_1.z.number().min(0, "Purchase price must be positive").optional(),
    currentValue: zod_1.z.number().min(0, "Current value must be positive").optional(),
    verificationStatus: zod_1.z.enum(["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"]).optional(),
    verificationNotes: zod_1.z.string().max(500, "Verification notes must not exceed 500 characters").optional(),
    isActive: zod_1.z.boolean().optional(),
});
