import { Request, Response, NextFunction } from "express";
import propertyService from "../services/property.service";
import { propertyValidator, updatePropertyValidator } from "../validators/property.validators";
import AppError from "../utils/appError";

export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const search = (req.query.search as string) || "";
    const orderBy = (req.query.orderBy as string) === "asc" ? "asc" : "desc";

    const result = await propertyService.getAllProperties(ownerId, {
      page,
      limit,
      search,
      orderBy,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const propertyId = req.params.id as string;
    const property = await propertyService.getPropertyById(propertyId, ownerId);

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const validatedData = propertyValidator.parse(req.body);
    const property = await propertyService.createProperty(ownerId, validatedData);

    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const propertyId = req.params.id as string;
    const validatedData = updatePropertyValidator.parse(req.body);
    const updatedProperty = await propertyService.updateProperty(propertyId, ownerId, validatedData);

    res.status(200).json({
      status: "success",
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const propertyId = req.params.id as string;
    await propertyService.deleteProperty(propertyId, ownerId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
