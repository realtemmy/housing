// users, authentication, login jwt etc
import express, { Application } from "express";

// App
const app: Application = express();

app.use(express.json());

import AppError from "./utils/appError";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

import { Request, Response } from "express";

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

const server = app.listen(process.env.PORT || 3300, () => {
  console.log(`App running on port ${process.env.PORT || 3300}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
