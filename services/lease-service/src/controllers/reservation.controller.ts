import { Request, Response, NextFunction } from "express";
import reservationService from "../services/reservation.service";
import { reservationValidator, updateReservationValidator } from "../validators/reservation.validators";
import AppError from "../utils/appError";

export const getAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservorId, status, type } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await reservationService.getAllReservations({
      page,
      limit,
      reservorId: reservorId as string | undefined,
      status: status as string | undefined,
      reservationType: type as 'unit' | 'room' | 'bed' | undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservationId = req.params.id as string;
    const reservation = await reservationService.getReservationById(reservationId);

    res.status(200).json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationsByReservor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservorId = req.params.id as string;
    const { status, type } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await reservationService.getReservationsByReservor(reservorId, {
      page,
      limit,
      status: status as string | undefined,
      reservationType: type as 'unit' | 'room' | 'bed' | undefined,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = reservationValidator.parse(req.body);
    const reservation = await reservationService.createReservation(validatedData);

    res.status(201).json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservationId = req.params.id as string;
    const validatedData = updateReservationValidator.parse(req.body);
    const reservation = await reservationService.updateReservation(reservationId, validatedData);

    res.status(200).json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservationId = req.params.id as string;
    await reservationService.deleteReservation(reservationId);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};