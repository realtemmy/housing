import { Request, Response, NextFunction } from "express";
import unitService from "../services/unit.service";
import { unitValidator, updateUnitValidator } from "../validators/unit.validators";
import AppError from "../utils/appError";

export const getAllUnits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const { propertyId, buildingId, status } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await unitService.getAllUnits(ownerId, {
      page,
      limit,
      propertyId: propertyId as string | undefined,
      buildingId: buildingId as string | undefined,
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

export const getUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const unitId = req.params.id as string;
    const unit = await unitService.getUnitById(unitId, ownerId);

    res.status(200).json({
      status: "success",
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

export const unitAvailable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    const unitId = req.params.id as string;
    const result = await unitService.checkUnitAvailability(unitId, ownerId);

    res.status(200).json({
      status: "success",
      available: result.available,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const createUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const validatedData = unitValidator.parse(req.body);
    const unit = await unitService.createUnit(ownerId, validatedData);

    res.status(201).json({
      status: "success",
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const unitId = req.params.id as string;
    const validatedData = updateUnitValidator.parse(req.body);

    const updatedUnit = await unitService.updateUnit(unitId, ownerId, validatedData);

    res.status(200).json({
      status: "success",
      data: updatedUnit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const unitId = req.params.id as string;
    await unitService.deleteUnit(unitId, ownerId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
