import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test runtime data model in detail
async function testRuntimeDataModelDetail() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Checking runtime data model in detail ===");

    if (prisma._runtimeDataModel) {
      console.log("_runtimeDataModel exists");

      // Check models
      if (prisma._runtimeDataModel.models) {
        console.log("\n_runtimeDataModel.models:");
        const modelNames = Object.keys(prisma._runtimeDataModel.models);
        console.log(`  Keys: ${modelNames.join(', ')}`);

        // Check what's in each model entry
        for (const modelName of modelNames) {
          const modelInfo = prisma._runtimeDataModel.models[modelName];
          console.log(`  ${modelName}: ${typeof modelInfo}`);
          if (modelInfo && typeof modelInfo === 'object') {
            console.log(`    Properties: ${Object.keys(modelInfo).join(', ')}`);
          }
        }
      }

      // Check enums
      if (prisma._runtimeDataModel.enums) {
        console.log("\n_runtimeDataModel.enums:");
        const enumNames = Object.keys(prisma._runtimeDataModel.enums);
        console.log(`  Keys: ${enumNames.join(', ')}`);
      }

      // Check types
      if (prisma._runtimeDataModel.types) {
        console.log("\n_runtimeDataModel.types:");
        const typeNames = Object.keys(prisma._runtimeDataModel.types);
        console.log(`  Keys: ${typeNames.join(', ')}`);
      }
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testRuntimeDataModelDetail();