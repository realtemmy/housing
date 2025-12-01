import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";

export const extractUser = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError("Authorization header missing", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("No token in header", 401));
    }

    // Decode without verification - Kong already verified it
    const decoded = jwt.decode(token) as { id: string } | null;

    if (!decoded || !decoded.id) {
      return next(new AppError("Invalid token format", 401));
    }

    // Attach userId to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Error in extractUser middleware:", error);
    next(new AppError("Token processing failed", 401));
  }
};
