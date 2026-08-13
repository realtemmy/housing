import express, { Application } from "express";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import leaseRoutes from "./routes/lease.routes";

const app: Application = express();

app.use(express.json());

// Routes
app.use("/api/leases", leaseRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
