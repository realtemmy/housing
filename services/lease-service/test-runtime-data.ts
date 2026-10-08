import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test runtime data model
async function testRuntimeDataModel() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Checking runtime data model ===");

    if (prisma._runtimeDataModel) {
      console.log("_runtimeDataModel exists:", typeof prisma._runtimeDataModel);

      // Check if it has model information
      if (prisma._runtimeDataModel.models) {
        console.log("_runtimeDataModel.models exists");
        const modelNames = Object.keys(prisma._runtimeDataModel.models);
        console.log(`Models in runtime data: ${modelNames.join(', ')}`);

        // Check for our specific models
        const targetModels = ['Application', 'Reservation', 'PaymentTransaction', 'Tenant', 'Lease', 'LeaseRenewal', 'LeasePayment'];
        for (const model of targetModels) {
          const exists = modelNames.includes(model);
          console.log(`  ${model}: ${exists ? '✓ FOUND' : '✗ MISSING'}`);
        }
      } else {
        console.log("_runtimeDataModel.models does not exist");
      }

      // Show what's in _runtimeDataModel
      console.log("\n_runtimeDataModel keys:");
      const keys = Object.keys(prisma._runtimeDataModel);
      console.log(keys.join(', '));
    } else {
      console.log("_runtimeDataModel does not exist");
    }

    // Also check the _engine property
    if (prisma._engine) {
      console.log("\n_engine exists:", typeof prisma._engine);
      if (prisma._engine._modelData) {
        console.log("_engine._modelData exists");
        // This might contain schema information
      }
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testRuntimeDataModel();