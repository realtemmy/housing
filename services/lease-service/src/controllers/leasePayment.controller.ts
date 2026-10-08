import { Request, Response, NextFunction } from "express";
import leasePaymentService from "../services/leasePayment.service";
import { leasePaymentValidator, updateLeasePaymentValidator } from "../validators/leasePayment.validators";
import AppError from "../utils/appError";

export const getAllLeasePayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { leaseId, status } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await leasePaymentService.getAllLeasePayments({
      page,
      limit,
      leaseId: leaseId as string | undefined,
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

export const getLeasePaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = req.params.id as string;
    const payment = await leasePaymentService.getLeasePaymentById(paymentId);

    res.status(200).json({
      status: "success",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const createLeasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = leasePaymentValidator.parse(req.body);
    const payment = await leasePaymentService.createLeasePayment(validatedData);

    res.status(201).json({
      status: "success",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = req.params.id as string;
    const validatedData = updateLeasePaymentValidator.parse(req.body);
    const payment = await leasePaymentService.updateLeasePayment(paymentId, validatedData);

    res.status(200).json({
      status: "success",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLeasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = req.params.id as string;
    await leasePaymentService.deleteLeasePayment(paymentId);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};