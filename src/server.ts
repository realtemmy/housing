import { createApp } from "./app";
import { config } from "./config/env";
import { logger } from "./lib/logger";
import { getPrismaClient, disconnectPrisma } from "./lib/db";
import { BackgroundJobManager } from "./lib/cron";

async function bootstrap() {
  try {
    logger.info("Connecting to DirectKey database...");
    const prisma = await getPrismaClient();

    // Verify DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connection established successfully.");

    // Start background cron jobs (reservation release, rent due reminders)
    BackgroundJobManager.start();

    const app = createApp();

    const server = app.listen(config.PORT, () => {
      logger.info(`DirectKey API server running on http://localhost:${config.PORT}`);
      logger.info(`OpenAPI Swagger documentation available at http://localhost:${config.PORT}/api-docs`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      BackgroundJobManager.stop();

      server.close(async () => {
        logger.info("HTTP server closed.");
        await disconnectPrisma();
        logger.info("Database disconnected. Exiting process.");
        process.exit(0);
      });

      // Force exit after 10s if hanging
      setTimeout(() => {
        logger.error("Forced exit after shutdown timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err: any) {
    logger.error("Failed to start DirectKey API server", { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

export { bootstrap };
