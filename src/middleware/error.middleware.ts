import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.requestId || (req.headers["x-request-id"] as string) || "unknown";

  // Operational AppErrors
  if (err instanceof AppError) {
    logger.warn(`Operational Error [${err.code}]: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      requestId,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
    return;
  }

  // Prisma Unique Constraint Violation
  if (err.code === "P2002") {
    const target = err.meta?.target ? `Duplicate field: ${err.meta.target}` : "Record already exists with this value";
    res.status(409).json({
      success: false,
      error: {
        code: "CONFLICT",
        message: target,
        requestId,
      },
    });
    return;
  }

  // Prisma Record Not Found
  if (err.code === "P2025") {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested record was not found",
        requestId,
      },
    });
    return;
  }

  // Unhandled Programmer / System Error
  logger.error("Unhandled Exception in API handler", err, {
    requestId,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === "production" ? "An internal server error occurred" : err.message,
      requestId,
    },
  });
}

export const errorHandler = globalErrorHandler;
