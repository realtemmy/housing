import express, { Application } from "express";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import leaseRoutes from "./routes/lease.routes";
import leasePaymentRoutes from "./routes/leasePayment.routes";
import leaseRenewalRoutes from "./routes/leaseRenewal.routes";
import applicationRoutes from "./routes/application.routes";
import reservationRoutes from "./routes/reservation.routes";
import paymentRoutes from "./routes/payment.routes";
import leaseAgreementRoutes from "./routes/leaseAgreement.routes";

const app: Application = express();

app.use(express.json());

// Routes
app.use("/api/leases", leaseRoutes);
app.use("/api/lease-payments", leasePaymentRoutes);
app.use("/api/lease-renewals", leaseRenewalRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/lease-agreements", leaseAgreementRoutes);

// Catch all unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
