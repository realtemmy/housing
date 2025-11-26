import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";

export const extractUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(new AppError("Authorization header missing", 401));

  const token = authHeader.split(" ")[1];
  if (!token) return next(new AppError("No token in header", 401));
  const decoded = jwt.decode(token);
  if (!decoded) return next(new AppError("Invalid token format", 401));
  (req as any).userId = decoded;
  next();
};
