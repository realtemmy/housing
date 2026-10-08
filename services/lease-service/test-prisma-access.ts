import { Prisma } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test accessing models through the Prisma namespace
async function testPrismaNamespace() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, using mock for structure test");
      // For this test, we just want to see if the structure works, not actually connect
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("Testing Prisma namespace access:");
    console.log("Prisma.Application:", typeof Prisma.Application);
    console.log("Prisma.Application.findMany:", typeof Prisma.Application.findMany);
    console.log("Prisma.Application.create:", typeof Prisma.Application.create);

    console.log("\nTesting direct prisma instance access:");
    console.log("prisma.application:", prisma.application);
    console.log("prisma.lease:", prisma.lease);

  } catch (error) {
    console.error(`Error:`, error);
  }
}

// For structure testing without DB connection
async function testStructure() {
  try {
    console.log("Testing structure without DB connection:");
    console.log("Prisma.Application:", typeof Prisma.Application);
    console.log("Prisma.Application.findMany:", typeof Prisma.Application.findMany);
    console.log("Prisma.Application.create:", typeof Prisma.Application.create);

    console.log("\nChecking if we can access the model methods:");
    if (Prisma.Application && typeof Prisma.Application.findMany === 'function') {
      console.log("✓ Prisma.Application.findMany is accessible");
    } else {
      console.log("✗ Prisma.Application.findMany is NOT accessible");
    }

    if (Prisma.Application && typeof Prisma.Application.create === 'function') {
      console.log("✓ Prisma.Application.create is accessible");
    } else {
      console.log("✗ Prisma.Application.create is NOT accessible");
    }

  } catch (error) {
    console.error(`Error in structure test:`, error);
  }
}

testStructure();