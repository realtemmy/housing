import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test using raw SQL to simulate model operations
async function testRawSql() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Testing raw SQL operations ===");

    // Test if we can execute a simple query
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log("Raw query result:", result);
    } catch (error) {
      console.error("Raw query error:", error);
    }

    // Test if we can execute a simple update (this will fail without a real table, but let's see the error)
    try {
      const result = await prisma.$executeRaw`UPDATE "Application" SET applicationFeePaid = true WHERE id = 'test-id'`;
      console.log("Raw execute result:", result);
    } catch (error) {
      console.error("Raw execute error:", error);
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testRawSql();