"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBuildingValidator = exports.buildingValidator = void 0;
const zod_1 = require("zod");
const address_validators_1 = require("./address.validators");
exports.buildingValidator = zod_1.z.object({
    propertyId: zod_1.z.string(), // Changed from uuid to string to match Prisma schema
    name: zod_1.z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
    description: zod_1.z
        .string()
        .max(500, "Description should not exceed 500 characters")
        .optional()
        .nullable(),
    summary: zod_1.z.string().max(500, "Summary should not exceed 500 characters").optional(),
    floors: zod_1.z
        .number()
        .int()
        .min(0, "Floors must be zero or positive")
        .optional(),
    address: address_validators_1.addressFieldsValidator,
});
exports.updateBuildingValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name must not be empty").max(200, "Name must not exceed 200 characters").optional(),
    description: zod_1.z
        .string()
        .max(500, "Description should not exceed 500 characters")
        .optional()
        .nullable(),
    summary: zod_1.z.string().max(500, "Summary should not exceed 500 characters").optional(),
    floors: zod_1.z
        .number()
        .int()
        .min(0, "Floors must be zero or positive")
        .optional(),
    verified: zod_1.z.boolean().optional(),
});
