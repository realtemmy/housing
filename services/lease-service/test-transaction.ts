import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test if transaction callback gets a working prisma instance
async function testTransaction() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("Testing if transaction callback gets working prisma instance...");

    const result = await prisma.$transaction(async (tx) => {
      console.log("In transaction callback:");
      console.log("  tx.application:", tx.application);
      console.log("  tx.reservation:", tx.reservation);
      console.log("  tx.paymentTransaction:", tx.paymentTransaction);
      console.log("  tx.lease:", tx.lease);

      // Try to access a method on a working model
      if (tx.lease) {
        console.log("  tx.lease.count:", typeof tx.lease.count);
      }

      // Return something to confirm the transaction worked
      return { success: true };
    });

    console.log("Transaction result:", result);

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testTransaction();