import { Request, Response, NextFunction } from "express";
import paymentService from "../services/payment.service";
import { paymentValidator, refundPaymentValidator } from "../validators/payment.validators";
import AppError from "../utils/appError";

export const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = paymentValidator.parse(req.body);
    const result = await paymentService.processPayment(validatedData);

    if (result.success) {
      res.status(201).json({
        status: "success",
        data: result,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = req.params.id as string;
    const validatedData = refundPaymentValidator.parse(req.body);
    const result = await paymentService.refundPayment(transactionId, validatedData.amount);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = req.params.id as string;
    const transaction = await paymentService.getPaymentTransactionById(transactionId);

    res.status(200).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsForApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id as string;
    const { page, limit } = req.query;
    const options = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const result = await paymentService.getPaymentsForApplication(applicationId, options);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsForReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservationId = req.params.id as string;
    const { page, limit } = req.query;
    const options = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const result = await paymentService.getPaymentsForReservation(reservationId, options);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsForLeasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leasePaymentId = req.params.id as string;
    const { page, limit } = req.query;
    const options = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const result = await paymentService.getPaymentsForLeasePayment(leasePaymentId, options);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};