import { Request, Response, NextFunction } from "express";
import applicationService from "../services/application.service";
import { applicationValidator, updateApplicationValidator } from "../validators/application.validators";
import AppError from "../utils/appError";

export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicantId, status, type } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await applicationService.getAllApplications({
      page,
      limit,
      applicantId: applicantId as string | undefined,
      status: status as string | undefined,
      applicationType: type as 'property' | 'unit' | 'room' | 'bed' | undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id as string;
    const application = await applicationService.getApplicationById(applicationId);

    res.status(200).json({
      status: "success",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicantId = req.params.id as string;
    const { status, type } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await applicationService.getApplicationsByApplicant(applicantId, {
      page,
      limit,
      status: status as string | undefined,
      applicationType: type as 'property' | 'unit' | 'room' | 'bed' | undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = applicationValidator.parse(req.body);
    const application = await applicationService.createApplication(validatedData);

    res.status(201).json({
      status: "success",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id as string;
    const validatedData = updateApplicationValidator.parse(req.body);
    const application = await applicationService.updateApplication(applicationId, validatedData);

    res.status(200).json({
      status: "success",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id as string;
    await applicationService.deleteApplication(applicationId);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};