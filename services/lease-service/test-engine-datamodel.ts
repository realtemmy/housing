import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test engine datamodel
async function testEngineDatamodel() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Checking _engine.datamodel ===");

    if (prisma._engine && prisma._engine.datamodel) {
      const datamodel = prisma._engine.datamodel;
      console.log(`_engine.datamodel length: ${datamodel.length} characters`);

      // Check if it contains our model names
      const modelsToCheck = ['Application', 'Reservation', 'PaymentTransaction', 'Tenant', 'Lease', 'LeaseRenewal', 'LeasePayment'];
      console.log("\nChecking for model names in datamodel:");
      for (const modelName of modelsToCheck) {
        const contains = datamodel.includes(modelName);
        console.log(`  ${modelName}: ${contains ? '✓ FOUND' : '✗ MISSING'}`);
      }

      // Show a sample of the datamodel to see what it looks like
      console.log("\nFirst 500 characters of datamodel:");
      console.log(datamodel.substring(0, 500));

      // Show last 500 characters
      console.log("\nLast 500 characters of datamodel:");
      console.log(datamodel.substring(datamodel.length - 500));

    } else {
      console.log("_engine.datamodel does not exist");
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testEngineDatamodel();