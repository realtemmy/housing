import { z } from "zod";
import { ReservationStatus } from "../generated/prisma/client";

export const reservationValidator = z.object({
  reservorId: z.string().min(1, "Reservor ID is required"),
  reservationType: z.enum(['unit', 'room', 'bed']),
  reservationId: z.string().min(1, "Reservation target ID is required"),
  applicationId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  reservationFee: z.number().min(0, "Reservation fee must be zero or positive").optional(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional(),
  notes: z.string().optional(),
});

export const updateReservationValidator = z.object({
  applicationId: z.string().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  reservationFee: z.number().min(0, "Reservation fee must be zero or positive").optional(),
  reservationFeePaid: z.boolean().optional(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional(),
  depositPaid: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  status: z.nativeEnum(ReservationStatus).optional(),
});