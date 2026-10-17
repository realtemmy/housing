import express from "express";
import cors from "cors";
import crypto from "crypto";
import { config } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rateLimit.middleware";
import { docsRoutes } from "./docs/swagger";

// Module routes
import { authRoutes } from "./modules/auth/auth.routes";
import { propertyRoutes } from "./modules/property/property.routes";
import { listingRoutes } from "./modules/listing/listing.routes";
import { verificationRoutes } from "./modules/verification/verification.routes";
import { transactionRoutes } from "./modules/transaction/transaction.routes";
import { tenancyRoutes } from "./modules/tenancy/tenancy.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { maintenanceRoutes } from "./modules/maintenance/maintenance.routes";
import { issueRoutes } from "./modules/issue/issue.routes";
import { handoverRoutes } from "./modules/handover/handover.routes";
import { notificationRoutes } from "./modules/notification/notification.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";

export function createApp() {
  const app = express();

  // Basic security and parsing
  app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Attach Request ID
  app.use((req, res, next) => {
    const requestId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    next();
  });

  // Global Rate Limiter
  app.use(rateLimiter(100, 60000));

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      service: "DirectKey Modular Monolith API",
    });
  });

  // API Documentation
  app.use("/api-docs", docsRoutes);

  // Mount API v1 routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/properties", propertyRoutes);
  app.use("/api/v1/listings", listingRoutes);
  app.use("/api/v1/verifications", verificationRoutes);
  app.use("/api/v1/transactions", transactionRoutes);
  app.use("/api/v1/tenancies", tenancyRoutes);
  app.use("/api/v1/payments", paymentRoutes);
  app.use("/api/v1/maintenance", maintenanceRoutes);
  app.use("/api/v1/issues", issueRoutes);
  app.use("/api/v1/handovers", handoverRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/dashboards", dashboardRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Endpoint ${req.method} ${req.originalUrl} does not exist`,
      },
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
