"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressValidator = exports.addressValidator = exports.addressFieldsValidator = void 0;
const zod_1 = require("zod");
// Base address fields without buildingId (for nested creation)
exports.addressFieldsValidator = zod_1.z.object({
    street: zod_1.z.string().min(1, "Street is required"),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
    postalCode: zod_1.z.string().min(1, "Postal code is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
});
// Full address validator with buildingId (for standalone creation)
exports.addressValidator = exports.addressFieldsValidator.extend({
    buildingId: zod_1.z.uuid("Invalid building ID"),
});
exports.updateAddressValidator = zod_1.z.object({
    street: zod_1.z.string().min(1, "Street is required").optional(),
    city: zod_1.z.string().min(1, "City is required").optional(),
    state: zod_1.z.string().min(1, "State is required").optional(),
    postalCode: zod_1.z.string().min(1, "Postal code is required").optional(),
    country: zod_1.z.string().min(1, "Country is required").optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
});
