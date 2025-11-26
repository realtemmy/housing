import { Request, Response, NextFunction } from "express";
import {
  buildingValidator,
  updateBuildingValidator,
} from "../validators/buildingValidators";
import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export const getAllBuildings = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const search = (req.query.search as string) || "";
  const orderBy = (req.query.orderBy as string) === "asc" ? "asc" : "desc";
  const propertyId =
    (req.query.propertyId as string) || (req.params.propertyId as string);

  const skip = (page - 1) * limit;

  const [totalItems, buildings] = await prisma.$transaction([
    prisma.building.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        propertyId,
      },
    }),
    prisma.building.findMany({
      skip,
      take: limit,
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        propertyId,
      },
      orderBy: {
        createdAt: orderBy,
      },
      include: {
        _count: { select: { units: true } },
        property: { select: { id: true, title: true } },
        address: { select: { id: true, city: true, state: true } },
      },
    }),
  ]);
  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: "success",
    data: {
      items: buildings,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  });
};

export const getBuilding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const buildingId = req.params.id as string;

  const building = await prisma.building.findUniqueOrThrow({
    where: { id: buildingId },
    include: {
      _count: { select: { units: true } },
      address: true,
      units: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: building,
  });
};

export const createBuilding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedBuilding = buildingValidator.parse(req.body);
  const { propertyId, name, floors, address, type } = validatedBuilding;

  // Verify property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  const building = await prisma.building.create({
    data: {
      propertyId,
      name,
      floors: floors ?? 0,
      type,
      address: {
        create: {
          city: address.city,
          country: address.country,
          state: address.state,
          postalCode: address.postalCode,
          street: address.street,
          latitude: address.latitude ?? null,
          longitude: address.longitude ?? null,
        },
      },
    },
    include: {
      property: true,
    },
  });

  res.status(201).json({
    status: "success",
    data: building,
  });
};

export const updateBuilding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const buildingId = req.params.id as string;
  const validatedData = updateBuildingValidator.parse(req.body);

  await prisma.building.findUniqueOrThrow({
    where: { id: buildingId },
  });

  // Build an update payload that omits undefined values so Prisma doesn't receive `undefined`
  const dataToUpdate: any = {};
  if (validatedData.name !== undefined) dataToUpdate.name = validatedData.name;
  if (validatedData.floors !== undefined)
    dataToUpdate.floors = validatedData.floors;

  const updatedBuilding = await prisma.building.update({
    where: { id: buildingId },
    data: dataToUpdate,
    include: {
      property: true,
      units: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedBuilding,
  });
};

export const deleteBuilding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const buildingId = req.params.id as string;

  const building = await prisma.building.findUnique({
    where: { id: buildingId },
    include: {
      units: true,
    },
  });

  if (!building) {
    return next(new AppError("No Building with ID found", 404));
  }

  if (building.units.length > 0) {
    return next(
      new AppError(
        "Cannot delete building with existing units. Delete units first.",
        400
      )
    );
  }

  await prisma.building.delete({
    where: { id: buildingId },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
};
