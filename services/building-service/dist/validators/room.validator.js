"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomValidator = exports.roomValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.roomValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Room name is required"),
    description: zod_1.z.string().optional().nullable(),
    summary: zod_1.z.string().optional().nullable(),
    size: zod_1.z.number().int().nonnegative().optional().nullable(),
    type: zod_1.z.string().optional(),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional().nullable(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.AvailableStatus).optional().default("AVAILABLE"),
    unitId: zod_1.z.string().min(1, "Unit ID is required"),
});
exports.updateRoomValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Room name must not be empty").optional(),
    description: zod_1.z.string().optional().nullable(),
    summary: zod_1.z.string().optional().nullable(),
    size: zod_1.z.number().int().nonnegative().optional().nullable(),
    type: zod_1.z.string().optional(),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional().nullable(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.AvailableStatus).optional(),
    occupantId: zod_1.z.string().optional().nullable(),
    verified: zod_1.z.boolean().optional(),
});
