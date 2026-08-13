import { Request, Response, NextFunction } from "express";
import roomService from "../services/room.service";
import { roomValidator, updateRoomValidator } from "../validators/room.validator";
import AppError from "../utils/appError";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const { unitId, propertyId, status } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await roomService.getAllRooms(ownerId, {
      page,
      limit,
      unitId: unitId as string | undefined,
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

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const roomId = req.params.id as string;
    const room = await roomService.getRoomById(roomId, ownerId);

    res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const validatedData = roomValidator.parse(req.body);
    const room = await roomService.createRoom(ownerId, validatedData);

    res.status(201).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const roomId = req.params.id as string;
    const validatedData = updateRoomValidator.parse(req.body);

    const updatedRoom = await roomService.updateRoom(roomId, ownerId, validatedData);

    res.status(200).json({
      status: "success",
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return next(new AppError("User unauthenticated", 401));
    }

    const roomId = req.params.id as string;
    await roomService.deleteRoom(roomId, ownerId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
