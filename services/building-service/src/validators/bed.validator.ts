import { z } from "zod";
import { AvailableStatus } from "../generated/prisma/client";

export const bedValidator = z.object({
  label: z.string().min(1, "Label is required"),
  rentAmount: z.number().min(0, "Rent amount must be zero or positive"),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
  status: z.nativeEnum(AvailableStatus).optional().default("AVAILABLE"),
  roomId: z.string().min(1, "Room ID is required"),
  occupantId: z.string().optional().nullable(),
});

export const updateBedValidator = z.object({
  label: z.string().min(1, "Label must not be empty").optional(),
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
  status: z.nativeEnum(AvailableStatus).optional(),
  occupantId: z.string().optional().nullable(),
  roomId: z.string().optional(),
});