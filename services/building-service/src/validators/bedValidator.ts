import { z } from "zod";
import { AvailableStatus } from "../generated/prisma/enums";

export const bedValidator = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long"),
  rentAmount: z.number().min(1, "Rent amount must be at least 1"),
  depositAmount: z
    .number()
    .min(1, "Deposit amount must be at least 1")
    .optional(),
  status: z.enum(AvailableStatus).default(AvailableStatus.AVAILABLE),
  occupantId: z.string().optional(),
  roomId: z.string(),
});

export const updateBedValidator = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long").optional(),
  rentAmount: z.number().min(1, "Rent amount must be at least 1").optional(),
  depositAmount: z
    .number()
    .min(1, "Deposit amount must be at least 1")
    .optional(),
  status: z.enum(AvailableStatus),
  occupantId: z.string().optional(),
  roomId: z.string().optional(),
});