import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test simulating findUnique with raw SQL
async function testFindUnique() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log("DATABASE_URL not set, skipping test");
      return;
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("=== Testing findUnique simulation with raw SQL ===");

    // Simulate: prisma.application.findUnique({ where: { id: 'some-id' } })
    const testId = 'some-test-id';

    try {
      // Using raw SQL to simulate findUnique
      const result = await prisma.$queryRaw<
        Array<{ id: string; applicantId: string }>
      >`SELECT id, applicantId FROM "Application" WHERE id = ${testId} LIMIT 1`;

      // Convert result to match findUnique format (single object or null)
      const found = result.length > 0 ? result[0] : null;
      console.log("FindUnique result:", found);

    } catch (error) {
      console.error("FindUnique error:", error);
    }

    // Simulate: prisma.application.create({ data: { ... } })
    try {
      const result = await prisma.$queryRaw<
        Array<{ id: string; applicantId: string }>
      >`INSERT INTO "Application" (id, applicantId) VALUES ('test-id-2', 'test-applicant') RETURNING id, applicantId`;

      const created = result.length > 0 ? result[0] : null;
      console.log("Create result:", created);

    } catch (error) {
      console.error("Create error:", error);
    }

    // Simulate: prisma.application.update({ where: { id: 'id' }, data: { applicationFeePaid: true } })
    try {
      const result = await prisma.$executeRaw`
        UPDATE "Application"
        SET applicationFeePaid = true
        WHERE id = 'test-id-3'
      `;
      console.log("Update result:", result); // Returns number of affected rows

    } catch (error) {
      console.error("Update error:", error);
    }

  } catch (error) {
    console.error(`Error:`, error);
  }
}

testFindUnique();