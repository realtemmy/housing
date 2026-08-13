// users, authentication, login jwt etc
import express, { Application } from "express";
import cors from "cors";
import kafkaService from "./kafka/kafka";

// App
const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for development
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

import AppError from "./utils/appError";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

import { Request, Response } from "express";
import { Server } from "http";

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Auth Service",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Catch all unknown routes
app.use((req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
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
    // await producer.connect()
    await kafkaService.connect();
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
