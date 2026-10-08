import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test direct instantiation
async function testDirect() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("PrismaClient created successfully");
    console.log("Type of prisma:", typeof prisma);
    console.log("Has application property:", !!prisma.application);
    console.log("Application property value:", prisma.application);

    if (prisma.application) {
      const count = await prisma.application.count();
      console.log(`Application count: ${count}`);
    } else {
      console.log("prisma.application is undefined or null");

      // Let's see what properties ARE available
      const props = Object.getOwnPropertyNames(prisma);
      console.log("Available properties on prisma instance:", props.join(", "));
    }
  } catch (error) {
    console.error(`Error in direct test:`, error);
  }
}

testDirect();