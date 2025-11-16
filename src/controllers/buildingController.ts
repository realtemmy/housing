import { Request, Response, NextFunction } from "express";
import {
  buildingValidator,
  updateBuildingValidator,
} from "../validators/buildingValidators";
import prisma from "../client/prisma";
import AppError from "../utils/appError";

interface Ifilter {
  propertyId?: string;
  lng?: number;
  lat?: number;
}

export const getAllBuildings = async (req: Request, res: Response) => {
  const filter: Ifilter = {};

  if (req.query.propertyId) {
    filter.propertyId = req.query.propertyId as string;
  }

  const useGeo = req.query.lng && req.query.lat;

  let buildings;

  // ---------------------------------------------------
  // 1️⃣ If geolocation query is included → raw query first
  // ---------------------------------------------------
  if (useGeo) {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius
      ? parseFloat(req.query.radius as string)
      : 10; // default 10 km

    const rawBuildings = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        b.id,
        b.name,
        b."propertyId",
        b."addressId",
        a.latitude,
        a.longitude,
        (6371 * acos(
          cos(radians(${lat})) 
          * cos(radians(a.latitude)) 
          * cos(radians(a.longitude) - radians(${lng}))
          + sin(radians(${lat})) * sin(radians(a.latitude))
        )) AS distance
      FROM "Building" b
      LEFT JOIN "Address" a ON a.id = b."addressId"
      ${
        filter.propertyId ? `WHERE b."propertyId" = '${filter.propertyId}'` : ""
      }
      HAVING distance <= ${radius}
      ORDER BY distance ASC;
    `);

    // Now fetch the full Prisma-typed buildings with relations
    const ids = rawBuildings.map((b) => b.id);

    buildings = await prisma.building.findMany({
      where: { id: { in: ids } },
    });

    // Re-attach distance values to Prisma results
    buildings = buildings.map((b) => {
      const match = rawBuildings.find((rb) => rb.id === b.id);
      return { ...b, distance: match?.distance ?? null };
    });
  }

  // --------------------------------------------------
  // 2️⃣ If normal filter only → run basic Prisma query
  // --------------------------------------------------
  else {
    buildings = await prisma.building.findMany({
      where: filter,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        units: {
          select: {
            id: true,
            unitNumber: true,
            status: true,
          },
        },
      },
    });
  }

  return res.status(200).json({
    status: "success",
    results: buildings.length,
    data: buildings,
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
      property: true,
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
  const { propertyId, name, floors } = validatedBuilding;

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
      name: name ?? null,
      floors: floors ?? null,
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
  if (validatedData.floors !== undefined) dataToUpdate.floors = validatedData.floors;

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
