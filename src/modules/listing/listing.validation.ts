import { z } from "zod";
import { ListingStatus, BillingFrequency, ViewingStatus } from "../../generated/prisma/client";

export const createListingSchema = z.object({
  propertyId: z.string().uuid(),
  unitId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  bedId: z.string().uuid().optional(),
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  displayPrice: z.number().positive("Display price must be positive"),
  cautionDeposit: z.number().min(0).default(0),
  serviceCharge: z.number().min(0).default(0),
  billingFrequency: z.nativeEnum(BillingFrequency).default(BillingFrequency.ANNUAL),
  amenities: z.array(z.string()).default([]),
  photos: z.array(z.string().url()).default([]),
  status: z.nativeEnum(ListingStatus).default(ListingStatus.DRAFT),
});

export const updateListingSchema = createListingSchema.partial().omit({ propertyId: true });

export const searchListingQuerySchema = z.object({
  area: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  bedrooms: z.string().transform(Number).optional(),
  propertyType: z.string().optional(),
  billingFrequency: z.nativeEnum(BillingFrequency).optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "popular"]).default("newest"),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const createViewingRequestSchema = z.object({
  preferredDate: z.string().datetime(),
  alternativeDate: z.string().datetime().optional(),
  contactPhone: z.string().min(10, "Contact phone is required"),
  notes: z.string().optional(),
});

export const updateViewingRequestSchema = z.object({
  status: z.nativeEnum(ViewingStatus),
  confirmedDate: z.string().datetime().optional(),
  hostNotes: z.string().optional(),
});

export const createEnquirySchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export const respondEnquirySchema = z.object({
  response: z.string().min(1, "Response cannot be empty"),
  status: z.enum(["RESPONDED", "CLOSED"]).default("RESPONDED"),
});
