import { z } from "zod";
import { AvailableStatus } from "../generated/prisma/client";

export const roomValidator = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  size: z.number().int().nonnegative().optional().nullable(),
  type: z.string().optional(),
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional().nullable(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
  status: z.nativeEnum(AvailableStatus).optional().default("AVAILABLE"),
  unitId: z.string().min(1, "Unit ID is required"),
});

export const updateRoomValidator = z.object({
  name: z.string().min(1, "Room name must not be empty").optional(),
  description: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  size: z.number().int().nonnegative().optional().nullable(),
  type: z.string().optional(),
  rentAmount: z.number().min(0, "Rent amount must be zero or positive").optional().nullable(),
  depositAmount: z.number().min(0, "Deposit amount must be zero or positive").optional().nullable(),
  status: z.nativeEnum(AvailableStatus).optional(),
  occupantId: z.string().optional().nullable(),
  verified: z.boolean().optional(),
});