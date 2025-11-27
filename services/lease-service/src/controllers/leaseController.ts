import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { prisma } from "../lib/prisma";
import {
  leaseValidator,
  updateLeaseValidator,
} from "../validators/leaseValidator";
import axios from "axios";
import { Decimal } from "@prisma/client/runtime/client";
import kafkaService from "../kafka/kafka";

export const getAllLeases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const leases = await prisma.lease.findMany();
  res.status(200).json({
    status: "success",
    data: leases,
  });
};

export const createLease = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).userId;
  const validatedLease = leaseValidator.parse(req.body);
  const { unitId, rentAmount, serviceCharge, paymentFrequency } =
    validatedLease;

  try {
    //   const unitCheck = await axios.get(
    //     `${process.env.BUILDING_SERVICE_URL}/unit/${unitId}`
    //   );
    const unitCheck = await axios.get(
      `http://localhost:4002/units/${unitId}/available`
    );
    if (!unitCheck.data.available) {
      return next(new AppError("This unit is no longer available", 409));
    }
  } catch (error) {
    return next(new AppError("Could not verify unit's availability", 500));
  }

  let tenant = await prisma.tenant.findUnique({
    where: { userId },
  });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { userId } });
  }

  const rentDec = new Decimal(rentAmount);
  const serviceDec = new Decimal(serviceCharge || 0);
  const totalDec = rentDec.add(serviceDec);

  const newLease = await prisma.lease.create({
    data: {
      unitId,
      tenantId: tenant.id,
      rentAmount: rentDec,
      serviceCharge: serviceDec,
      totalAmount: totalDec,
      paymentFrequency,
    },
  });
  await kafkaService.leaseCreated({
    leaseId: newLease.id,
    unitId,
    totalAmount: totalDec,
  });
  res.status(201).json({
    status: "success",
    leaseId: newLease.id,
    amount: totalDec.toString(),
    currency: "NGN",
  });
};

// Confirm hand over of keys - rent starts counting (using escrow)
// loans using kwaba
