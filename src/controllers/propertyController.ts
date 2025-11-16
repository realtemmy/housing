import { Request, Response, NextFunction } from "express";
import { propertyValidator } from "../validators/propertyValidators";

import prisma from "../client/prisma";
import AppError from "../utils/appError";
import { User } from "../generated/schema";

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
  console.log("Property ID: ", propertyId);
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
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const user: User = req.user as User;
  try {
    const validatedProperty = propertyValidator.parse(req.body);
    const { title, type, description } = validatedProperty;

    const property = await prisma.property.create({
      data: { title, ownerId: user.id, type, description: description ?? null },
    });

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.error("Error: ", error);
    next(error);
  }
};

export const deleteProperty = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const user: User = req.user as User;
  const propertyId = req.params.id as string;
  // Check if user attempting to delete is the one who created the property
  const creator = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });
  if (creator.ownerId !== user.id)
    return next(
      new AppError(
        "You do not have access to delete this property as you didn't create it.",
        403
      )
    );
  await prisma.property.delete({ where: { id: propertyId } });
  res.status(204).json({ status: "success", data: null });
};
