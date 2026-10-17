import { z } from "zod";
import { HandoverType, ConditionRating, ItemCondition } from "../../generated/prisma/client";

export const createHandoverSchema = z.object({
  tenancyId: z.string().uuid(),
  type: z.nativeEnum(HandoverType).default(HandoverType.MOVE_IN),
  scheduledDate: z.string().datetime(),
  inspectorId: z.string().uuid().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      area: z.string().min(1, "Area is required (e.g. Living Room, Bedroom)"),
      item: z.string().min(1, "Item is required (e.g. Walls, Light fixtures, Locks)"),
      condition: z.nativeEnum(ItemCondition).default(ItemCondition.PASS),
      notes: z.string().optional(),
      photoUrls: z.array(z.string().url()).default([]),
    })
  ).default([]),
});

export const updateHandoverChecklistSchema = z.object({
  keysHandedCount: z.number().int().min(0).optional(),
  meterReadings: z.record(z.string(), z.string()).optional(),
  overallCondition: z.nativeEnum(ConditionRating).optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().uuid().optional(),
      area: z.string().min(1),
      item: z.string().min(1),
      condition: z.nativeEnum(ItemCondition),
      notes: z.string().optional(),
      photoUrls: z.array(z.string().url()).default([]),
    })
  ).optional(),
});

export const completeHandoverOtpSchema = z.object({
  otp: z.string().length(6, "6-digit OTP is required"),
});
