import { z } from "zod";
import { ListingStatus } from "../generated/prisma/client";

export const listingValidator = z.object({
  listingTitle: z.string().optional().nullable(),
  listingDescription: z.string().optional().nullable(),
  listingStatus: z.nativeEnum(ListingStatus).optional(),
  listingViews: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  virtualTourUrl: z.string().url().optional().nullable(),
  amenities: z.any().optional(),
});

export type ListingUpdateInput = z.infer<typeof listingValidator>;