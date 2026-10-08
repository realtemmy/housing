import { PrismaClient } from "./src/generated/prisma/client";

// Test creating PrismaClient without adapter
async function testNoAdapter() {
  try {
    console.log("Creating PrismaClient without adapter...");

    // This will fail because we don't have a datasource URL, but let's see if we can at least create the instance
    const prisma = new PrismaClient();

    console.log("PrismaClient created successfully");
    console.log("Checking model accessors:");

    const modelsToCheck = ['Application', 'Reservation', 'PaymentTransaction', 'Tenant', 'Lease', 'LeaseRenewal', 'LeasePayment'];
    for (const modelName of modelsToCheck) {
      const uppercase = modelName;
      const lowercase = modelName.charAt(0).toLowerCase() + modelName.slice(1);

      const upperExists = prisma[uppercase as keyof typeof prisma] !== undefined;
      const lowerExists = prisma[lowercase as keyof typeof prisma] !== undefined;

      console.log(`${modelName}: uppercase=${upperExists}, lowercase=${lowerExists}`);
    }

  } catch (error) {
    console.error(`Error creating PrismaClient without adapter:`, error);
  }
}

testNoAdapter();