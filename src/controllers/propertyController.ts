import { Request, Response, NextFunction } from "express";
import { propertyValidator } from "../validators/propertyValidators";

import prisma from "../client/prisma";
import AppError from "../utils/appError";

export const getAllProperties = async (req: Request, res: Response) => {
  const properties = await prisma.property.findMany();
  res.status(200).json({ status: "success", data: properties });
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const propertyId = req.params.id as string;
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) return next(new AppError("No Property with ID found", 404));

  res.status(200).json({
    status: "success",
    data: property,
  });
};

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedProperty = propertyValidator.parse(req.body);
  const { title, ownerId, type, description } = validatedProperty;
  const property = await prisma.property.create({
    data: { title, ownerId, type, description: description ?? null },
  });

  res.status(200).json({
    status: "success",
    data: property,
  });
};
