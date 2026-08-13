import { Request, Response, NextFunction } from "express";
import bedService from "../services/bed.service";
import { bedValidator } from "../validators/bed.validator";
import AppError from "../utils/appError";

export const getAllBeds = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const { roomId, propertyId, status } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;

    const result = await bedService.getAllBeds(ownerId, {
      page,
      limit,
      roomId: roomId as string | undefined,
      propertyId: propertyId as string | undefined,
      status: status as string | undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBedById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const bedId = req.params.id as string;
    const bed = await bedService.getBedById(bedId, ownerId);

    res.status(200).json({
      status: "success",
      data: bed,
    });
  } catch (error) {
    next(error);
  }
};

export const createBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const validatedData = bedValidator.parse(req.body);
    const createdBed = await bedService.createBed(ownerId, validatedData);

    res.status(201).json({
      status: "success",
      data: createdBed,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const bedId = req.params.id as string;
    const updatedBed = await bedService.updateBed(bedId, ownerId, req.body);

    res.status(200).json({
      status: "success",
      data: updatedBed,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const bedId = req.params.id as string;
    await bedService.deleteBed(bedId, ownerId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
