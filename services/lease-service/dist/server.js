"use strict";
// lease, occupancy, payment links etc
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lease events: lease.created, lease.activated, lease.paymentDue, lease.expired, lease.renewed
// background jobs to check for expiring/soon to expire leases and send notifications
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
// App
const app_1 = __importDefault(require("./app"));
// Rent payment job
const rentPaymentJob_1 = __importDefault(require("./services/rentPaymentJob"));
// Server
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
const server = app_1.default.listen(process.env.PORT || 4003, () => {
    console.log(`App running on port ${process.env.PORT || 4003}...`);
    // Start the rent payment job
    rentPaymentJob_1.default.start();
});
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    rentPaymentJob_1.default.stop();
    server.close(() => {
        console.log("Process terminated");
    });
});
