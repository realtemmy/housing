import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { config } from "../config/env";
import { logger } from "./logger";

let prismaInstance: PrismaClient | null = null;
let activePool: Pool | null = null;
let pgliteServerInstance: any = null;

export async function getPrismaClient(): Promise<PrismaClient> {
  if (prismaInstance) {
    return prismaInstance;
  }

  // Check if we should attempt connection to configured DATABASE_URL
  const useExternalPg = config.DATABASE_URL && !config.DATABASE_URL.includes("test-in-memory");

  if (useExternalPg) {
    try {
      const pool = new Pool({
        connectionString: config.DATABASE_URL,
        connectionTimeoutMillis: 5000,
        max: 20,
      });

      // Test query to ensure PostgreSQL is reachable
      const client = await pool.connect();
      client.release();

      activePool = pool;
      const adapter = new PrismaPg(pool);
      prismaInstance = new PrismaClient({ adapter });
      logger.info("Connected to PostgreSQL via PrismaPg adapter");
      return prismaInstance;
    } catch (err: any) {
      logger.error("Failed to connect to configured PostgreSQL database", err);
      // In production, NEVER silently fall back to ephemeral in-memory database!
      if (config.NODE_ENV === "production") {
        throw new Error(`Production database connection failed: ${err.message}. Refusing silent fallback to in-memory database.`);
      }
      logger.warn("Non-production environment: falling back to embedded PGlite instance", { error: err.message });
    }
  }

  // Fallback / In-Memory PGlite PostgreSQL instance
  try {
    const { PGlite } = await import("@electric-sql/pglite");
    const { PGLiteSocketServer } = await import("@electric-sql/pglite-socket");

    const db = new PGlite();
    
    // Apply migration SQL if available
    const migrationPath = path.resolve(process.cwd(), "prisma/migrations/0_init/migration.sql");
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, "utf8");
      await db.exec(sql);
      logger.info("Applied migration.sql to embedded PGlite database");
    }

    // Pick an ephemeral port for the local socket server
    const ephemeralPort = 54000 + Math.floor(Math.random() * 1000);
    const server = new PGLiteSocketServer({ db, port: ephemeralPort, host: "127.0.0.1" });
    await server.start();
    pgliteServerInstance = server;

    const pool = new Pool({
      connectionString: `postgresql://postgres:password@127.0.0.1:${ephemeralPort}/postgres`,
      max: 1,
    });
    activePool = pool;

    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
    logger.info(`Initialized in-process PGlite database on port ${ephemeralPort}`);
    return prismaInstance;
  } catch (err: any) {
    logger.error("Failed to initialize embedded PGlite database", err);
    throw err;
  }
}

export async function closeDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
  if (activePool) {
    await activePool.end();
    activePool = null;
  }
  if (pgliteServerInstance) {
    await pgliteServerInstance.stop();
    pgliteServerInstance = null;
  }
  logger.info("Database connections closed cleanly");
}

export const disconnectPrisma = closeDatabase;

// Export a proxy or placeholder that ensures initialization
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!prismaInstance) {
      throw new Error("Database not initialized yet. Ensure await getPrismaClient() is called on app startup.");
    }
    return (prismaInstance as any)[prop];
  },
});
