import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { Prisma } from "../generated/prisma/client"

/* -------------------------------
   ENV-SPECIFIC ERROR SENDERS
--------------------------------- */

const sendErrorDev = (err: AppError, res: Response) => {
  console.log("Error 💥:", err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    // Known & handled errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown / Programming errors
    console.error("UNEXPECTED ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

/* -------------------------------
   PRISMA & JWT ERROR HANDLERS
--------------------------------- */

// Prisma: Unique constraint failed (e.g. duplicate email)
const handleUniqueConstraintError = (
  err: Prisma.PrismaClientKnownRequestError
): AppError => {
  const target = (err.meta && (err.meta.target as string[])) || ["field"];
  const message = `Duplicate value for field: ${target.join(
    ", "
  )}. Please use another value.`;
  return new AppError(message, 400);
};

// Prisma: Record not found
const handleRecordNotFoundError = (
  err: Prisma.PrismaClientKnownRequestError
): AppError => {
  const message = "Record not found. Please check your request.";
  return new AppError(message, 404);
};

// Prisma: Foreign key constraint failed (invalid relationship)
const handleForeignKeyConstraintError = (
  err: Prisma.PrismaClientKnownRequestError
): AppError => {
  const message = "Operation failed due to related record constraint.";
  return new AppError(message, 400);
};

// Prisma: Invalid data type or validation failed
const handleValidationError = (
  err: Prisma.PrismaClientValidationError
): AppError => {
  const message = "Invalid data input. Please check your fields and try again.";
  return new AppError(message, 400);
};

// JWT: Invalid or expired tokens
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

// Cloudinary (optional external)
const handleCloudinaryError = (): AppError =>
  new AppError("Error uploading image. Please try again later.", 400);

/* -------------------------------
   GLOBAL ERROR HANDLER
--------------------------------- */

export default (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: any = { ...err };
    error.message = err.message;

    // Prisma error handling (based on error codes)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") error = handleUniqueConstraintError(err); // Duplicate field
      if (err.code === "P2025") error = handleRecordNotFoundError(err); // Record not found
      if (err.code === "P2003") error = handleForeignKeyConstraintError(err); // Foreign key constraint
    }

    // Prisma validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
      error = handleValidationError(err);
    }

    // JWT-related errors
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    // Optional: Cloudinary/network error
    if (err.code === "ENOTFOUND") error = handleCloudinaryError();

    sendErrorProd(error, res);
  }

  next();
};
