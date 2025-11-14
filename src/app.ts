import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

const app: Application = express();

app.use(cors({ origin: "*" }));

const limiter = rateLimit({
  max: 100,
  windowMs: 3 * 60 * 1000,
  message: "Too many requests from this IP, please try again after 3 minutes",
});

app.use(limiter);

import propertyRoutes from "./routes/propertyRoutes";

app.use("/api/v1/property", propertyRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
