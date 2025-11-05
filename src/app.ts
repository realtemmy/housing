import express, { Application, Request, Response } from "express";
import cors from "cors";
import AppError from "./utils/appError";

const app:Application = express();

app.use(cors({origin: "*"}))




// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;
