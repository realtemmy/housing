// lease, occupancy, payment links etc

// lease events: lease.created, lease.activated, lease.paymentDue, lease.expired, lease.renewed
// background jobs to check for expiring/soon to expire leases and send notifications
import express from "express";

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// App
import app from "./app";

// Server
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const server = app.listen(process.env.PORT || 4003, () => {
  console.log(`App running on port ${process.env.PORT || 4003}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
