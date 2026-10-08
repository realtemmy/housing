import { Request, Response, NextFunction } from "express";
import listingService from "../services/listing.service";
import { listingValidator } from "../validators/listing.validators";
import AppError from "../utils/appError";

export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, id } = req.params;
    const listingType = type as 'property' | 'unit' | 'room' | 'bed';

    // Validate listing type
    if (!['property', 'unit', 'room', 'bed'].includes(listingType)) {
      throw new AppError("Invalid listing type. Must be property, unit, room, or bed", 400);
    }

    const listing = await listingService.getListing(listingType, id);

    res.status(200).json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, id } = req.params;
    const listingType = type as 'property' | 'unit' | 'room' | 'bed';

    // Validate listing type
    if (!['property', 'unit', 'room', 'bed'].includes(listingType)) {
      throw new AppError("Invalid listing type. Must be property, unit, room, or bed", 400);
    }

    const validatedData = listingValidator.parse(req.body);
    const listing = await listingService.updateListing(listingType, id, validatedData);

    res.status(200).json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;
    const listingType = type === 'property' || type === 'unit' || type === 'room' || type === 'bed'
      ? type as 'property' | 'unit' | 'room' | 'bed'
      : undefined;

    const options = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      listingStatus: req.query.listingStatus as string | undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      minViews: req.query.minViews ? parseInt(req.query.minViews as string, 10) : undefined,
    };

    const result = await listingService.getListings(listingType, options);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};