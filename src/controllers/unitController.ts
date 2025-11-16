import { Request, Response, NextFunction } from "express";
import { unitValidator, updateUnitValidator } from "../validators/unitValidators";
import prisma from "../client/prisma";
import AppError from "../utils/appError";

export const getAllUnits = async (req: Request, res: Response) => {
  const { propertyId, buildingId, status } = req.query;

  const whereClause: any = {};
  if (propertyId) whereClause.propertyId = propertyId as string;
  if (buildingId) whereClause.buildingId = buildingId as string;
  if (status) whereClause.status = status as string;

  const units = await prisma.unit.findMany({
    where: whereClause,
    include: {
      photos: true,
      leases: {
        where: {
          status: "ACTIVE",
        },
      },
    },
  });

  res.status(200).json({ status: "success", data: units });
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
      property: true,
      building: true,
      photos: true,
      leases: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      maintenance: {
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!unit) {
    return next(new AppError("No Unit with ID found", 404));
  }

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
    propertyId,
    buildingId,
  } = validatedUnit;

  // Verify property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Verify building exists if buildingId is provided
  if (buildingId) {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return next(new AppError("Building not found", 404));
    }

    // Verify building belongs to the property
    if (building.propertyId !== propertyId) {
      return next(
        new AppError("Building does not belong to this property", 400)
      );
    }
  }

  // Check if unit number already exists for this property
  const existingUnit = await prisma.unit.findUnique({
    where: {
      propertyId_unitNumber: {
        propertyId,
        unitNumber,
      },
    },
  });

  if (existingUnit) {
    return next(
      new AppError("Unit number already exists for this property", 400)
    );
  }

  const unit = await prisma.unit.create({
    data: {
      unitNumber,
      floor: floor ?? null,
      bedrooms: bedrooms ?? null,
      bathrooms: bathrooms ?? null,
      sqft: sqft ?? null,
      status: status ?? "AVAILABLE",
      rentAmount,
      depositAmount: depositAmount ?? null,
      propertyId,
      buildingId: buildingId ?? null,
    },
    include: {
      property: true,
      building: true,
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

  // If buildingId is being updated, verify it belongs to the property
  if (validatedData.buildingId) {
    const building = await prisma.building.findUnique({
      where: { id: validatedData.buildingId },
    });

    if (!building) {
      return next(new AppError("Building not found", 404));
    }

    if (building.propertyId !== unit.propertyId) {
      return next(
        new AppError("Building does not belong to this property", 400)
      );
    }
  }

  // If unit number is being updated, check for duplicates
  if (validatedData.unitNumber && validatedData.unitNumber !== unit.unitNumber) {
    const existingUnit = await prisma.unit.findUnique({
      where: {
        propertyId_unitNumber: {
          propertyId: unit.propertyId,
          unitNumber: validatedData.unitNumber,
        },
      },
    });

    if (existingUnit) {
      return next(
        new AppError("Unit number already exists for this property", 400)
      );
    }
  }

  const updatedUnit = await prisma.unit.update({
    where: { id: unitId },
    data: {
      ...validatedData,
    },
    include: {
      property: true,
      building: true,
      photos: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedUnit,
  });
};

export const deleteUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const unitId = req.params.id as string;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      leases: {
        where: {
          status: {
            in: ["ACTIVE", "PENDING"],
          },
        },
      },
    },
  });

  if (!unit) {
    return next(new AppError("No Unit with ID found", 404));
  }

  if (unit.leases.length > 0) {
    return next(
      new AppError(
        "Cannot delete unit with active or pending leases. Terminate leases first.",
        400
      )
    );
  }

  await prisma.unit.delete({
    where: { id: unitId },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

export const getAvailableUnits = async (req: Request, res: Response) => {
  const { propertyId } = req.query;

  const whereClause: any = { status: "AVAILABLE" };
  if (propertyId) whereClause.propertyId = propertyId as string;

  const units = await prisma.unit.findMany({
    where: whereClause,
    include: {
      property: {
        select: {
          id: true,
          title: true,
          type: true,

        },
      },
      building: {
        select: {
          id: true,
          name: true,
        },
      },
      photos: true,
    },
  });

  res.status(200).json({ status: "success", data: units });
};
