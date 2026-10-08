import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test dbName in runtime data model
async function testDbName() {
  try {
    console.log("Starting testDbName...");
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter }) as any; // Cast to any to access internal properties

    console.log("PrismaClient created");

    console.log("=== Checking dbName in runtime data model ===");

    if (prisma._runtimeDataModel && prisma._runtimeDataModel.models) {
      console.log("_runtimeDataModel.models exists");
      const modelNames = Object.keys(prisma._runtimeDataModel.models);
      console.log(`Model names: ${modelNames.join(', ')}`);

      for (const modelName of modelNames) {
        const modelInfo = prisma._runtimeDataModel.models[modelName];
        console.log(`${modelName}:`);
        if (modelInfo) {
          console.log(`  dbName: ${modelInfo.dbName}`);
          console.log(`  fields: ${typeof modelInfo.fields}`);
        } else {
          console.log(`  modelInfo is null or undefined`);
        }
      }
    } else {
      console.log("_runtimeDataModel or .models is missing");
      if (prisma._runtimeDataModel) {
        console.log(`_runtimeDataModel exists: ${typeof prisma._runtimeDataModel}`);
        console.log(`_runtimeDataModel keys: ${Object.keys(prisma._runtimeDataModel).join(', ')}`);
      }
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testDbName();