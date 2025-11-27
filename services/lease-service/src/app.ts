import express, { Application, Request, Response } from "express";
import AppError from "./utils/appError";

import globalErrorHandler from "./controllers/errorController"

const app: Application = express();

app.use(express.json());

// import propertyRoutes from "./routes/propertyRoutes";

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Lease routes!",
  });
});

// app.use("/api/properties", propertyRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
