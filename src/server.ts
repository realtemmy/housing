import dotenv from "dotenv";
import app from "./app"; // Use import instead of require

dotenv.config({ path: "../config.env" });

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const server = app.listen(process.env.PORT || 3300, () => {
  console.log(`App running on port ${process.env.PORT || 3300}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
