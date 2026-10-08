import { Request, Response, NextFunction } from "express";
import leaseAgreementService from "../services/leaseAgreement.service";
import {
  generateLeaseAgreementValidator,
  signLeaseAgreementValidator,
  executeLeaseAgreementValidator,
  terminateLeaseAgreementValidator
} from "../validators/leaseAgreement.validators";
import AppError from "../utils/appError";

export const generateLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = generateLeaseAgreementValidator.parse(req.body);
    const result = await leaseAgreementService.generateLeaseAgreement(validatedData);

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const signLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = signLeaseAgreementValidator.parse(req.body);
    const { leaseId } = req.params;

    // Add leaseId to the validated data for the service
    const input = { ...validatedData, leaseId };
    const result = await leaseAgreementService.signLeaseAgreement(input);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { leaseId } = req.params;
    const agreement = await leaseAgreementService.getLeaseAgreement(leaseId);

    res.status(200).json({
      status: "success",
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

export const executeLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = executeLeaseAgreementValidator.parse(req.body);
    const result = await leaseAgreementService.executeLeaseAgreement(validatedData.leaseId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const terminateLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = terminateLeaseAgreementValidator.parse(req.body);
    const result = await leaseAgreementService.terminateLeaseAgreement(
      validatedData.leaseId,
      validatedData.reason
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};