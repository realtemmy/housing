"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationValidator = exports.reservationValidator = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.reservationValidator = zod_1.z.object({
    reservorId: zod_1.z.string().min(1, "Reservor ID is required"),
    reservationType: zod_1.z.enum(['unit', 'room', 'bed']),
    reservationId: zod_1.z.string().min(1, "Reservation target ID is required"),
    applicationId: zod_1.z.string().optional(),
    expiresAt: zod_1.z.string().datetime().optional(),
    reservationFee: zod_1.z.number().min(0, "Reservation fee must be zero or positive").optional(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateReservationValidator = zod_1.z.object({
    applicationId: zod_1.z.string().optional().nullable(),
    expiresAt: zod_1.z.string().datetime().optional().nullable(),
    reservationFee: zod_1.z.number().min(0, "Reservation fee must be zero or positive").optional(),
    reservationFeePaid: zod_1.z.boolean().optional(),
    depositAmount: zod_1.z.number().min(0, "Deposit amount must be zero or positive").optional(),
    depositPaid: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.ReservationStatus).optional(),
});
