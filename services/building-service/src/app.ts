import express, { Application } from "express";
import cors from "cors";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/error.controller";

import propertyRoutes from "./routes/property.routes";
import buildingRoutes from "./routes/building.routes";
import unitRoutes from "./routes/unit.routes";
import roomRoutes from "./routes/room.routes";
import bedRoutes from "./routes/bed.routes";

import job from "./jobs/reserved-check.jobs";

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Start background jobs
job.start();

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/beds", bedRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
