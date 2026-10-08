import { Request, Response, NextFunction } from "express";
import leaseService from "../services/lease.service";
import { leaseValidator, updateLeaseValidator } from "../validators/lease.validators";
import AppError from "../utils/appError";

export const getAllLeases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tenantId, rentableId, rentableType, status } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await leaseService.getAllLeases({
      page,
      limit,
      tenantId: tenantId as string | undefined,
      rentableId: rentableId as string | undefined,
      rentableType: rentableType as any, // TODO: Fix type casting
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

export const getLeaseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaseId = req.params.id as string;
    const lease = await leaseService.getLeaseById(leaseId);

    res.status(200).json({
      status: "success",
      data: lease,
    });
  } catch (error) {
    next(error);
  }
};

export const createLease = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = leaseValidator.parse(req.body);
    const lease = await leaseService.createLease(validatedData);

    res.status(201).json({
      status: "success",
      data: lease,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLease = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaseId = req.params.id as string;
    const validatedData = updateLeaseValidator.parse(req.body);
    const lease = await leaseService.updateLease(leaseId, validatedData);

    res.status(200).json({
      status: "success",
      data: lease,
    });
  } catch (error) {
    next(error);
  }
};