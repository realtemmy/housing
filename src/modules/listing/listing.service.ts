import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import { ListingStatus, ViewingStatus, BillingFrequency } from "../../generated/prisma/client";
import { verifyPropertyAccess } from "../../middleware/ownership.middleware";

export class ListingService {
  static async createListing(userId: string, data: {
    propertyId: string;
    unitId?: string;
    roomId?: string;
    bedId?: string;
    headline: string;
    description: string;
    displayPrice: number;
    cautionDeposit: number;
    serviceCharge?: number;
    billingFrequency: BillingFrequency;
    amenities: string[];
    photos: string[];
    status?: ListingStatus;
  }) {
    const hasAccess = await verifyPropertyAccess(data.propertyId, userId, "canManageListings");
    if (!hasAccess) {
      throw new ForbiddenError("You do not have permission to create listings for this property");
    }

    const prisma = await getPrismaClient();

    const listing = await prisma.listing.create({
      data: {
        propertyId: data.propertyId,
        unitId: data.unitId,
        roomId: data.roomId,
        bedId: data.bedId,
        headline: data.headline,
        description: data.description,
        displayPrice: data.displayPrice,
        cautionDeposit: data.cautionDeposit,
        serviceCharge: data.serviceCharge || 0,
        billingFrequency: data.billingFrequency,
        amenities: data.amenities,
        photos: data.photos,
        status: data.status || ListingStatus.DRAFT,
      },
      include: {
        property: {
          select: { id: true, title: true, area: true, city: true, verificationStatus: true },
        },
      },
    });

    return listing;
  }

  static async searchListings(params: {
    area?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: string;
    billingFrequency?: BillingFrequency;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(params);

    const where: any = {
      status: ListingStatus.PUBLISHED,
      property: {
        isActive: true,
        deletedAt: null,
      },
    };

    if (params.area) {
      where.property.area = { contains: params.area, mode: "insensitive" };
    }

    if (params.city) {
      where.property.city = { contains: params.city, mode: "insensitive" };
    }

    if (params.propertyType) {
      where.property.propertyType = params.propertyType;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.displayPrice = {};
      if (params.minPrice !== undefined) where.displayPrice.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.displayPrice.lte = params.maxPrice;
    }

    if (params.bedrooms !== undefined) {
      where.unit = {
        bedrooms: { gte: params.bedrooms },
      };
    }

    if (params.billingFrequency) {
      where.billingFrequency = params.billingFrequency;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sortBy === "price_asc") orderBy = { displayPrice: "asc" };
    if (params.sortBy === "price_desc") orderBy = { displayPrice: "desc" };
    if (params.sortBy === "popular") orderBy = { viewsCount: "desc" };

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              area: true,
              city: true,
              state: true,
              propertyType: true,
              verificationStatus: true,
              media: {
                where: { isCover: true },
                take: 1,
              },
            },
          },
          unit: {
            select: { id: true, unitNumber: true, bedrooms: true, bathrooms: true, sqft: true },
          },
          room: {
            select: { id: true, name: true, type: true },
          },
          bed: {
            select: { id: true, label: true },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  static async getListingById(id: string) {
    const prisma = await getPrismaClient();

    // Increment view count concurrently
    const listing = await prisma.listing.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
      include: {
        property: {
          include: {
            owner: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true },
            },
            media: true,
          },
        },
        unit: {
          include: {
            rooms: true,
            media: true,
          },
        },
        room: {
          include: {
            beds: true,
          },
        },
        bed: true,
      },
    });

    if (!listing) {
      throw new NotFoundError("Listing", id);
    }

    return listing;
  }

  static async updateListing(id: string, userId: string, data: any) {
    const prisma = await getPrismaClient();
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundError("Listing", id);

    const hasAccess = await verifyPropertyAccess(listing.propertyId, userId, "canManageListings");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.listing.update({
      where: { id },
      data,
    });
  }

  static async deleteListing(id: string, userId: string) {
    const prisma = await getPrismaClient();
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundError("Listing", id);

    const hasAccess = await verifyPropertyAccess(listing.propertyId, userId, "canManageListings");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    await prisma.listing.delete({ where: { id } });
    return { message: "Listing deleted successfully" };
  }

  static async getMyListings(userId: string, page = 1, limit = 20) {
    const prisma = await getPrismaClient();
    const { skip } = parsePagination({ page, limit });

    const where = {
      property: {
        OR: [
          { ownerId: userId },
          { agentAssignments: { some: { agentId: userId, isActive: true } } },
        ],
      },
    };

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: { id: true, title: true, area: true, city: true, verificationStatus: true },
          },
          unit: true,
          _count: {
            select: { applications: true, viewingRequests: true, enquiries: true },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return formatPaginated(items, total, page, limit);
  }

  // --- Viewing Requests ---
  static async createViewingRequest(listingId: string, tenantId: string, data: {
    preferredDate: string;
    alternativeDate?: string;
    contactPhone: string;
    notes?: string;
  }) {
    const prisma = await getPrismaClient();
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError("Listing", listingId);

    return prisma.viewingRequest.create({
      data: {
        listingId,
        tenantId,
        preferredDate: new Date(data.preferredDate),
        alternativeDate: data.alternativeDate ? new Date(data.alternativeDate) : undefined,
        contactPhone: data.contactPhone,
        notes: data.notes,
        status: ViewingStatus.PENDING,
      },
      include: {
        listing: {
          select: { id: true, headline: true },
        },
      },
    });
  }

  static async getViewingRequests(userId: string, role: string) {
    const prisma = await getPrismaClient();
    const where: any = {};

    if (role === "TENANT") {
      where.tenantId = userId;
    } else {
      where.listing = {
        property: {
          OR: [
            { ownerId: userId },
            { agentAssignments: { some: { agentId: userId, isActive: true } } },
          ],
        },
      };
    }

    return prisma.viewingRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: { id: true, headline: true, propertyId: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, phone: true, email: true },
        },
      },
    });
  }

  static async updateViewingStatus(viewingId: string, userId: string, data: {
    status: ViewingStatus;
    confirmedDate?: string;
    hostNotes?: string;
  }) {
    const prisma = await getPrismaClient();
    const viewing = await prisma.viewingRequest.findUnique({
      where: { id: viewingId },
      include: { listing: true },
    });
    if (!viewing) throw new NotFoundError("ViewingRequest", viewingId);

    const hasAccess = await verifyPropertyAccess(viewing.listing.propertyId, userId, "canManageListings");
    if (!hasAccess && viewing.tenantId !== userId) {
      throw new ForbiddenError("Permission denied");
    }

    return prisma.viewingRequest.update({
      where: { id: viewingId },
      data: {
        status: data.status,
        confirmedDate: data.confirmedDate ? new Date(data.confirmedDate) : undefined,
        hostNotes: data.hostNotes,
      },
    });
  }

  // --- Enquiries ---
  static async createEnquiry(listingId: string, tenantId: string, message: string) {
    const prisma = await getPrismaClient();
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError("Listing", listingId);

    return prisma.enquiry.create({
      data: {
        listingId,
        tenantId,
        message,
        status: "OPEN",
      },
      include: {
        listing: { select: { id: true, headline: true } },
      },
    });
  }

  static async getEnquiries(userId: string, role: string) {
    const prisma = await getPrismaClient();
    const where: any = {};

    if (role === "TENANT") {
      where.tenantId = userId;
    } else {
      where.listing = {
        property: {
          OR: [
            { ownerId: userId },
            { agentAssignments: { some: { agentId: userId, isActive: true } } },
          ],
        },
      };
    }

    return prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { id: true, headline: true } },
        tenant: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  static async respondEnquiry(enquiryId: string, userId: string, data: { response: string; status: string }) {
    const prisma = await getPrismaClient();
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: { listing: true },
    });
    if (!enquiry) throw new NotFoundError("Enquiry", enquiryId);

    const hasAccess = await verifyPropertyAccess(enquiry.listing.propertyId, userId, "canManageListings");
    if (!hasAccess) throw new ForbiddenError("Permission denied");

    return prisma.enquiry.update({
      where: { id: enquiryId },
      data: {
        response: data.response,
        status: data.status,
      },
    });
  }
}
