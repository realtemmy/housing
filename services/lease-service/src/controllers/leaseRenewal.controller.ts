import { Request, Response, NextFunction } from "express";
import leaseRenewalService from "../services/leaseRenewal.service";
import { leaseRenewalValidator, updateLeaseRenewalValidator } from "../validators/leaseRenewal.validators";
import AppError from "../utils/appError";

export const getAllLeaseRenewals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { leaseId, approved } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await leaseRenewalService.getAllLeaseRenewals({
      page,
      limit,
      leaseId: leaseId as string | undefined,
      approved: approved === "true" ? true : approved === "false" ? false : undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaseRenewalById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const renewalId = req.params.id as string;
    const renewal = await leaseRenewalService.getLeaseRenewalById(renewalId);

    res.status(200).json({
      status: "success",
      data: renewal,
    });
  } catch (error) {
    next(error);
  }
};

export const createLeaseRenewal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = leaseRenewalValidator.parse(req.body);
    const renewal = await leaseRenewalService.createLeaseRenewal(validatedData);

    res.status(201).json({
      status: "success",
      data: renewal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeaseRenewal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const renewalId = req.params.id as string;
    const validatedData = updateLeaseRenewalValidator.parse(req.body);
    const renewal = await leaseRenewalService.updateLeaseRenewal(renewalId, validatedData);

    res.status(200).json({
      status: "success",
      data: renewal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLeaseRenewal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const renewalId = req.params.id as string;
    await leaseRenewalService.deleteLeaseRenewal(renewalId);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};