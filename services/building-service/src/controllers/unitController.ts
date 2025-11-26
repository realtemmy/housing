import { Request, Response, NextFunction } from "express";
import {
  unitValidator,
  updateUnitValidator,
} from "../validators/unitValidators";
import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export const getAllUnits = async (req: Request, res: Response) => {
  const { propertyId, buildingId, status = "AVAILABLE" } = req.query;

  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (propertyId) whereClause.propertyId = propertyId as string;
  if (buildingId) whereClause.buildingId = buildingId as string;
  if (status) whereClause.status = status as string;

  const [totalItems, units] = await prisma.$transaction([
    prisma.unit.count({
      where: whereClause,
    }),
    prisma.unit.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        photos: true,
        building: { select: { id: true, name: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: "success",
    data: {
      items: units,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  });
};

export const getUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const unitId = req.params.id as string;

  const unit = await prisma.unit.findUniqueOrThrow({
    where: { id: unitId },
    include: {
      building: { select: { id: true, name: true } },
      photos: true,
      maintenance: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: unit,
  });
};

export const createUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUnit = unitValidator.parse(req.body);
  const {
    unitNumber,
    floor,
    bedrooms,
    bathrooms,
    sqft,
    status,
    rentAmount,
    depositAmount,
    buildingId,
    occupantId,
    type,
  } = validatedUnit;

  // Verify building exists if buildingId is provided
  if (buildingId) {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return next(new AppError("Building not found", 404));
    }
  }

  const unit = await prisma.unit.create({
    data: {
      unitNumber,
      floor: floor ?? null,
      bedrooms: bedrooms ?? null,
      bathrooms: bathrooms ?? null,
      sqft: sqft ?? null,
      type,
      status: status ?? "AVAILABLE",
      rentAmount,
      depositAmount: depositAmount ?? null,
      buildingId: buildingId,
    },
  });

  res.status(201).json({
    status: "success",
    data: unit,
  });
};

export const updateUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const unitId = req.params.id as string;
  const validatedData = updateUnitValidator.parse(req.body);

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
  });

  if (!unit) {
    return next(new AppError("No Unit with ID found", 404));
  }

  const updatedUnit = await prisma.unit.update({
    where: { id: unitId },
    data: {
      unitNumber: validatedData.unitNumber ?? unit.unitNumber,
      floor: validatedData.floor ?? unit.floor,
      bedrooms: validatedData.bedrooms ?? unit.bedrooms,
      bathrooms: validatedData.bathrooms ?? unit.bathrooms,
      sqft: validatedData.sqft ?? unit.sqft,
      status: validatedData.status ?? unit.status,
      rentAmount: validatedData.rentAmount ?? unit.rentAmount,
      depositAmount: validatedData.depositAmount ?? unit.depositAmount,
      buildingId: validatedData.buildingId ?? unit.buildingId,
    },
    include: {
      building: true,
      photos: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedUnit,
  });
};

// export const deleteUnit = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const unitId = req.params.id as string;

//   const unit = await prisma.unit.findUnique({
//     where: { id: unitId },
//   });

//   if (!unit) {
//     return next(new AppError("No Unit with ID found", 404));
//   }

//   await prisma.unit.delete({
//     where: { id: unitId },
//   });

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };
