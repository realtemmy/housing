import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";
import { bedValidator } from "../validators/bedValidator";

export const getAllBeds = async (req: Request, res: Response) => {
  const beds = await prisma.bed.findMany();

  res.status(200).json({
    status: "success",
    data: beds,
  });
};

export const getBedById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bedId = req.params.id as string;

  const bed = await prisma.bed.findUnique({
    where: {
      id: bedId,
    },
    select: { occupantId: true, room: true },
  });

  if (!bed) return next(new AppError("Bed not found", 404));

  res.status(200).json({
    status: "success",
    data: bed,
  });
};

export const createBed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    // check if occupantId is a real user
    // Check if bed exists
  const validatedBed = bedValidator.parse(req.body);
  const createdBed = await prisma.bed.create({
    data: validatedBed,
  });

  res.status(201).json({
    status: "success",
    data: createdBed,
  });
};

