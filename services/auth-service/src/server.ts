// users, authentication, login jwt etc
import express, { Application } from "express";
import cors from "cors";
import kafkaService from "./kafka/kafka";

// App
const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Configure based on environment
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import AppError from "./utils/appError";

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Auth Service is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Auth Service",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Catch all unknown routes
app.use((req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", error);

  // Default error values
  let statusCode = error.statusCode || 500;
  let status = error.status || "error";
  let message = error.message || "Internal Server Error";

  // Handle validation errors
  if (error.name === "ZodError") {
    statusCode = 400;
    status = "error";
    message = "Validation failed";

    // Format validation errors
    const errors = error.errors.map((err: any) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(statusCode).json({
      status,
      message,
      errors,
    });
  }

  // Handle Prisma errors
  if (error.code === "P2002") {
    statusCode = 409;
    status = "error";
    message = "A record with these values already exists";
  }

  res.status(statusCode).json({
    status,
    message,
  });
});

// Server
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

let server: Server;

const startServer = async () => {
  try {
    // Connect to Kafka
    await kafkaService.connect();

    // Start HTTP server
    server = app.listen(process.env.PORT || 4001, () => {
      console.log(
        `🚀 Auth Service listening on port ${process.env.PORT || 4001}`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Import types that were missing
import { Request, Response, NextFunction } from "express";
import { Server } from "http";