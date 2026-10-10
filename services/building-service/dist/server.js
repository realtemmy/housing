"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "./config.env" });
// App
const app_1 = __importDefault(require("./app"));
// Server
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
const server = app_1.default.listen(process.env.PORT, async () => {
    console.log(`App running on port ${process.env.PORT}...`);
});
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});
