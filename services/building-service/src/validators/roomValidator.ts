import { z } from "zod";
import { AvailableStatus } from "../generated/prisma/enums";

export const roomValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
  summary: z
    .string()
    .min(3, "Summary must be at least 3 characters long")
    .optional(),
  size: z.number().min(1, "Size must be at least 1").optional(),

  unitId: z.uuid(),
  rentAmount: z.number().min(1, "Rent amount must be at least 1"),
  depositAmount: z
    .number()
    .min(1, "Deposit amount must be at least 1")
    .optional(),
  status: z.enum(AvailableStatus).default(AvailableStatus.AVAILABLE),
  occupantId: z.string().optional(),
});

export const updateRoomValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
  summary: z
    .string()
    .min(3, "Summary must be at least 3 characters long")
    .optional(),
  size: z.number().min(1, "Size must be at least 1").optional(),

  unitId: z.uuid().optional(),
  rentAmount: z.number().min(1, "Rent amount must be at least 1").optional(),
  depositAmount: z
    .number()
    .min(1, "Deposit amount must be at least 1")
    .optional(),
  status: z.enum(AvailableStatus),
  occupantId: z.string().optional(),
});