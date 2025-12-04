import { Request, Response, NextFunction } from "express";
import { User } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    status: "success",
    data: users,
  });
};

export const getLoggedInUser = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const user: User = req.user as User;

  if (!user) return next(new AppError("User not found", 404));

  const loggedInUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  res.status(200).json({
    status: "success",
    data: loggedInUser,
  });
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id as string;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedFields = ["firstName", "lastName", "email", "role", "status"];
  const userId = req.params.is as string;

  const updateBody = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      (updateBody as any)[key] = req.body[key];
    }
  }
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id as string;
  await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  await prisma.user.delete({ where: { id: userId } });
  res.status(204).json({
    status: "success",
    data: null,
  });
};
