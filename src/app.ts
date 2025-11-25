import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import AppError from "../shared/utils/appError";
import globalErrorHandler from "../shared/utils/errorHandler";

const app: Application = express();

app.use(express.json())
app.use(cors({ origin: "*" }));

const limiter = rateLimit({
  max: 100,
  windowMs: 3 * 60 * 1000,
  message: "Too many requests from this IP, please try again after 3 minutes",
});

app.use(limiter);

import propertyRoutes from "./routes/propertyRoutes";
import userRoutes from "./routes/userRoutes";
import buildingRoutes from "./routes/buildingRoutes";
import unitRoutes from "./routes/unitRoutes";

app.use("/api/user", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/units", unitRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
