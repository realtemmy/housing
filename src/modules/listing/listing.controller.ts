import { Request, Response, NextFunction } from "express";
import { ListingService } from "./listing.service";

export class ListingController {
  static async createListing(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await ListingService.createListing(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Listing created successfully",
        data: listing,
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchListings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ListingService.searchListings({
        area: req.query.area as string,
        city: req.query.city as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string, 10) : undefined,
        propertyType: req.query.propertyType as string,
        billingFrequency: req.query.billingFrequency as any,
        sortBy: req.query.sortBy as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getListingById(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await ListingService.getListingById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: listing,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateListing(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ListingService.updateListing(req.params.id as string, req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteListing(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ListingService.deleteListing(req.params.id as string, req.user!.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMyListings(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await ListingService.getMyListings(req.user!.id, page, limit);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Viewings ---
  static async createViewingRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const viewing = await ListingService.createViewingRequest(
        req.params.listingId as string,
        req.user!.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Viewing request submitted",
        data: viewing,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getViewingRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const viewings = await ListingService.getViewingRequests(req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        data: viewings,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateViewingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ListingService.updateViewingStatus(
        req.params.viewingId as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Viewing status updated",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Enquiries ---
  static async createEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiry = await ListingService.createEnquiry(
        req.params.listingId as string,
        req.user!.id,
        req.body.message
      );
      res.status(201).json({
        success: true,
        message: "Enquiry submitted",
        data: enquiry,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiries = await ListingService.getEnquiries(req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        data: enquiries,
      });
    } catch (err) {
      next(err);
    }
  }

  static async respondEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ListingService.respondEnquiry(
        req.params.enquiryId as string,
        req.user!.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Response sent",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}
