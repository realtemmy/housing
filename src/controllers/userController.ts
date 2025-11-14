import { Request, Response, NextFunction } from "express";
import prisma from "../client/prisma";
import { User } from "../generated/schema";
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

  const loggedInUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

  res.status(200).json({
    status: "success",
    data: loggedInUser,
  });
};
