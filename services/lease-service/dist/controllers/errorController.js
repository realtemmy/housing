"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const client_1 = require("../generated/prisma/client");
/* -------------------------------
   ENV-SPECIFIC ERROR SENDERS
--------------------------------- */
const sendErrorDev = (err, res) => {
    console.log("Error 💥:", err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Known & handled errors
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
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
const handleUniqueConstraintError = (err) => {
    const target = (err.meta && err.meta.target) || ["field"];
    const message = `Duplicate value for field: ${target.join(", ")}. Please use another value.`;
    return new appError_1.default(message, 400);
};
// Prisma: Record not found
const handleRecordNotFoundError = (err) => {
    const message = "Record not found. Please check your request.";
    return new appError_1.default(message, 404);
};
// Prisma: Foreign key constraint failed (invalid relationship)
const handleForeignKeyConstraintError = (err) => {
    const message = "Operation failed due to related record constraint.";
    return new appError_1.default(message, 400);
};
// Prisma: Invalid data type or validation failed
const handleValidationError = (err) => {
    const message = "Invalid data input. Please check your fields and try again.";
    return new appError_1.default(message, 400);
};
// JWT: Invalid or expired tokens
const handleJWTError = () => new appError_1.default("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new appError_1.default("Your token has expired! Please log in again.", 401);
// Cloudinary (optional external)
const handleCloudinaryError = () => new appError_1.default("Error uploading image. Please try again later.", 400);
/* -------------------------------
   GLOBAL ERROR HANDLER
--------------------------------- */
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        // Prisma error handling (based on error codes)
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002")
                error = handleUniqueConstraintError(err); // Duplicate field
            if (err.code === "P2025")
                error = handleRecordNotFoundError(err); // Record not found
            if (err.code === "P2003")
                error = handleForeignKeyConstraintError(err); // Foreign key constraint
        }
        // Prisma validation error
        if (err instanceof client_1.Prisma.PrismaClientValidationError) {
            error = handleValidationError(err);
        }
        // JWT-related errors
        if (err.name === "JsonWebTokenError")
            error = handleJWTError();
        if (err.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        // Optional: Cloudinary/network error
        if (err.code === "ENOTFOUND")
            error = handleCloudinaryError();
        sendErrorProd(error, res);
    }
    next();
};
