import { Request, Response, NextFunction } from "express";
import {
  addressValidator,
  updateAddressValidator,
} from "../validators/addressValidators";
import prisma from "../client/prisma";
import AppError from "../utils/appError";

export const getAllAddresses = async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    include: {
      building: {
        select: {
          _count: { select: { units: true } },
          name: true,
          address: true,
        },
      },
    },
  });

  res.status(200).json({ status: "success", data: addresses });
};

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressId = req.params.id as string;

  const address = await prisma.address.findUniqueOrThrow({
    where: { id: addressId },
    include: {
      building: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: address,
  });
};

// export const getAddressByBuilding = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const buildingId = req.params.propertyId as string;

//   const address = await prisma.address.findUniqueOrThrow({
//     where: { id: buildingId },
//     include: {
//       buildings: true,
//     },
//   });

//   if (!address) {
//     return next(new AppError("No Address found for this property", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: address,
//   });
// };

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedAddress = addressValidator.parse(req.body);
  const {
    street,
    city,
    state,
    postalCode,
    country,
    longitude,
    latitude,
    buildingId,
  } = validatedAddress;

  // Verify building exists
  await prisma.building.findUniqueOrThrow({
    where: { id: buildingId },
  });

  const address = await prisma.address.create({
    data: {
      street,
      city,
      state,
      postalCode,
      country,
      longitude: longitude ?? null,
      latitude: latitude ?? null,
      buildingId,
    },
    include: {},
  });

  res.status(201).json({
    status: "success",
    data: address,
  });
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressId = req.params.id as string;
  const validatedData = updateAddressValidator.parse(req.body);

  const address = await prisma.address.findUniqueOrThrow({
    where: { id: addressId },
  });

  if (!address) {
    return next(new AppError("No Address with ID found", 404));
  }

  const updateData: any = {};
  const updatableFields = [
    "street",
    "city",
    "state",
    "postalCode",
    "country",
    "longitude",
    "latitude",
  ] as const;

  for (const key of updatableFields) {
    const value = (validatedData as any)[key];
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: updateData,
    include: {
      building: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedAddress,
  });
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressId = req.params.id as string;

  await prisma.address.findUniqueOrThrow({
    where: { id: addressId },
  });

  await prisma.address.delete({
    where: { id: addressId },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
};
