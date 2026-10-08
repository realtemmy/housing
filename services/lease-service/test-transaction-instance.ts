import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test if transaction gives us a working prisma instance
async function testTransactionInstance() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("Testing if transaction callback gives us working model accessors...");

    // We can't actually run the transaction without a database, but we can check
    // what the transaction method returns or how it works

    console.log("Transaction method:", typeof prisma.$transaction);

    // Let's see if we can get any information about what $transaction does
    // by looking at its length or other properties

    console.log("Transaction method length:", prisma.$transaction.length);

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testTransactionInstance();