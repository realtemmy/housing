import { prisma } from "./src/lib/prisma";

// Test if we can access the application model
async function test() {
  try {
    const count = await prisma.application.count();
    console.log(`Application count: ${count}`);
  } catch (error) {
    console.error(`Error accessing prisma.application:`, error);
  }
}

test();