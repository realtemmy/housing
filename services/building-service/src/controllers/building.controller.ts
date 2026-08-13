import { Request, Response, NextFunction } from "express";
import buildingService from "../services/building.service";
import { buildingValidator, updateBuildingValidator } from "../validators/building.validators";
import AppError from "../utils/appError";

export const getAllBuildings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const search = (req.query.search as string) || "";
    const orderBy = (req.query.orderBy as string) === "asc" ? "asc" : "desc";
    const propertyId = (req.query.propertyId as string) || (req.params.propertyId as string);

    const result = await buildingService.getAllBuildings(ownerId, {
      page,
      limit,
      search,
      orderBy,
      propertyId,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const buildingId = req.params.id as string;
    const building = await buildingService.getBuildingById(buildingId, ownerId);

    res.status(200).json({
      status: "success",
      data: building,
    });
  } catch (error) {
    next(error);
  }
};

export const createBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const validatedData = buildingValidator.parse(req.body);
    const building = await buildingService.createBuilding(ownerId, validatedData);

    res.status(201).json({
      status: "success",
      data: building,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const buildingId = req.params.id as string;
    const validatedData = updateBuildingValidator.parse(req.body);

    const updatedBuilding = await buildingService.updateBuilding(buildingId, ownerId, validatedData);

    res.status(200).json({
      status: "success",
      data: updatedBuilding,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const buildingId = req.params.id as string;
    await buildingService.deleteBuilding(buildingId, ownerId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
