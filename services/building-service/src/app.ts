import express, { Application, Request, Response } from "express";
import cors from "cors";
import AppError from "./utils/appError";

import globalErrorHandler from "./controllers/errorController";

const app: Application = express();

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

import propertyRoutes from "./routes/propertyRoutes";
import buildingRoutes from "./routes/buildingRoutes";
import unitRoutes from "./routes/unitRoutes";
// import 

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Properties routes!",
  });
});

app.use("/api/properties", propertyRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/units", unitRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
