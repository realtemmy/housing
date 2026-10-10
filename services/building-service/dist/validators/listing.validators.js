"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.listingValidator = zod_1.z.object({
    listingTitle: zod_1.z.string().optional().nullable(),
    listingDescription: zod_1.z.string().optional().nullable(),
    listingStatus: zod_1.z.nativeEnum(client_1.ListingStatus).optional(),
    listingViews: zod_1.z.number().int().min(0).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    virtualTourUrl: zod_1.z.string().url().optional().nullable(),
    amenities: zod_1.z.any().optional(),
});
