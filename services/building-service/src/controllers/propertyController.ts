import { Request, Response, NextFunction } from "express";
import {
  propertyValidator,
  updatePropertyValidator,
} from "../validators/propertyValidators";

import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export const getAllProperties = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const search = (req.query.search as string) || "";
  const orderBy = (req.query.orderBy as string) === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

  const [totalItems, properties] = await prisma.$transaction([
    prisma.property.count({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    }),

    prisma.property.findMany({
      skip,
      take: limit,
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      include: {
        _count: {
          select: { buildings: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: "success",
    data: {
      items: properties,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  });
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const propertyId = req.params.id as string;
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      _count: {
        select: { buildings: true },
      },
      buildings: true,
    },
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
  const userId = req.userId as string;
  try {
    const validatedProperty = propertyValidator.parse(req.body);
    const { title, description } = validatedProperty;

    const property = await prisma.property.create({
      data: { title, ownerId: userId, description: description ?? null },
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

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const propertyId = req.params.id as string;

  const updateData = {};
  const allowedFields = ["title", "floors", "propertyId"];
  for (let key of req.body) {
    if (allowedFields[key] !== null) {
      (updateData as any)[key] = allowedFields[key];
    }
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: updateData,
  });
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId as string;
  const propertyId = req.params.id as string;
  // Check if user attempting to delete is the one who created the property
  const creator = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });
  if (creator.ownerId !== userId)
    return next(
      new AppError(
        "You do not have access to delete this property as you didn't create it.",
        403
      )
    );
  await prisma.property.delete({ where: { id: propertyId } });
  res.status(204).json({ status: "success", data: null });
};
