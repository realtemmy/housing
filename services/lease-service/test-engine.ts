import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test engine property
async function testEngine() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Checking _engine property ===");

    if (prisma._engine) {
      console.log("_engine exists:", typeof prisma._engine);

      // Check if it has any model-related properties
      const engineKeys = Object.keys(prisma._engine);
      console.log(`_engine has ${engineKeys.length} properties`);

      // Look for model-related keys
      const modelRelatedKeys = engineKeys.filter(key =>
        key.toLowerCase().includes('model') ||
        key.toLowerCase().includes('application') ||
        key.toLowerCase().includes('reservation') ||
        key.toLowerCase().includes('paymenttransaction') ||
        key.toLowerCase().includes('tenant') ||
        key.toLowerCase().includes('lease')
      );

      console.log(`Model-related keys in _engine: ${modelRelatedKeys.join(', ')}`);

      // Show some key-value pairs
      console.log("\nSample _engine key-value pairs:");
      const sampleKeys = engineKeys.slice(0, 10);
      for (const key of sampleKeys) {
        console.log(`  ${key}: ${typeof prisma._engine[key as keyof typeof prisma._engine]}`);
      }
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testEngine();