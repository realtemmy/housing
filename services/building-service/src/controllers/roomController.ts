import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import {
  roomValidator,
  updateRoomValidator,
} from "../validators/roomValidator";

export const getAllRooms = async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany();

  res.status(200).json({
    status: "success",
    data: rooms,
  });
};

export const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomId = req.params.id as string;

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      beds: true,
    },
  });

  if (!room) return next(new AppError("Room not found", 404));

  res.status(200).json({
    status: "success",
    data: room,
  });
};

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedRoom = roomValidator.parse(req.body);
  const createdRoom = await prisma.room.create({
    data: validatedRoom,
  });

  res.status(201).json({
    status: "success",
    data: createdRoom,
  });
};

export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomId = req.params.id as string;

  const validatedRoom = updateRoomValidator.parse(req.body);

  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: validatedRoom,
  });

  if (!room) return next(new AppError("Room not found", 404));

  res.status(200).json({
    status: "success",
    data: room,
  });
};

export const deleteRoom = async (req: Request,res:Response, next: NextFunction) => {
  const roomId = req.params.id as string;

  const room = await prisma.room.delete({
    where: {
      id: roomId,
    },
  });

  if (!room) return next(new AppError("Room not found", 404));

  res.status(200).json({
    status: "success",
    data: room,
  });
}
