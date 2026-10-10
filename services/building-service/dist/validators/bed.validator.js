"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBedValidator = exports.bedValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.bedValidator = zod_1.z.object({
    label: zod_1.z.string().min(1, "Label is required"),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive"),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.AvailableStatus).optional().default("AVAILABLE"),
    roomId: zod_1.z.string().min(1, "Room ID is required"),
    occupantId: zod_1.z.string().optional().nullable(),
});
exports.updateBedValidator = zod_1.z.object({
    label: zod_1.z.string().min(1, "Label must not be empty").optional(),
    rentAmount: zod_1.z.number().min(0, "Rent amount must be zero or positive").optional(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.AvailableStatus).optional(),
    occupantId: zod_1.z.string().optional().nullable(),
    roomId: zod_1.z.string().optional(),
});
