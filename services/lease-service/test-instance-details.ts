import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test detailed instance properties
async function testInstanceDetails() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Checking model accessors on prisma instance ===");

    const modelsToCheck = ['Tenant', 'Lease', 'LeaseRenewal', 'LeasePayment', 'Application', 'Reservation', 'PaymentTransaction'];

    for (const modelName of modelsToCheck) {
      const uppercase = modelName;
      const lowercase = modelName.charAt(0).toLowerCase() + modelName.slice(1);

      const upperExists = prisma[uppercase as keyof typeof prisma] !== undefined;
      const lowerExists = prisma[lowercase as keyof typeof prisma] !== undefined;

      console.log(`${uppercase}: uppercase=${upperExists}, lowercase=${lowerExists}`);

      if (upperExists) {
        console.log(`  ${uppercase}.count: ${typeof prisma[uppercase as keyof typeof prisma].count}`);
      }
      if (lowerExists) {
        console.log(`  ${lowercase}.count: ${typeof prisma[lowercase as keyof typeof prisma].count}`);
      }
    }

    // Also check what properties are actually on the instance
    console.log("\n=== All properties on prisma instance ===");
    const props = Object.getOwnPropertyNames(prisma);
    console.log(`Total properties: ${props.length}`);

    // Filter to just the model-like properties
    const modelProps = props.filter(prop =>
      !prop.startsWith('_') &&
      prop !== 'constructor' &&
      prop !== '$extends' &&
      prop !== '$on' &&
      prop !== '$connect' &&
      prop !== '$disconnect' &&
      prop !== '$executeRawInternal' &&
      prop !== '$executeRaw' &&
      prop !== '$executeRawUnsafe' &&
      prop !== '$runCommandRaw' &&
      prop !== '$queryRawInternal' &&
      prop !== '$queryRaw' &&
      prop !== '$queryRawTyped' &&
      prop !== '$queryRawUnsafe' &&
      prop !== '$transaction' &&
      prop !== '_request' &&
      prop !== '_executeRequest' &&
      prop !== '_hasPreviewFlag' &&
      prop !== '$parent'
    );

    console.log(`Model-like properties (${modelProps.length}): ${modelProps.join(', ')}`);

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testInstanceDetails();