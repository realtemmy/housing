import * as PrismaNamespace from "./src/generated/prisma/internal/prismaNamespace";
import { Prisma as PrismaExport } from "./src/generated/prisma/client";

// Test what's actually exported
console.log("=== Testing Prisma namespace exports ===");

console.log("\n1. Direct import from internal/prismaNamespace:");
console.log("   PrismaNamespace.Application:", typeof PrismaNamespace.Application);
if (PrismaNamespace.Application) {
  console.log("   PrismaNamespace.Application.findMany:", typeof PrismaNamespace.Application.findMany);
}

console.log("\n2. Import via client.ts Prisma export:");
console.log("   PrismaExport.Application:", typeof PrismaExport.Application);
if (PrismaExport.Application) {
  console.log("   PrismaExport.Application.findMany:", typeof PrismaExport.Application.findMany);
}

console.log("\n3. Checking what's in the PrismaExport object:");
const keys = Object.keys(PrismaExport);
console.log("   Number of keys:", keys.length);
console.log("   First 20 keys:", keys.slice(0, 20).join(", "));

// Check if Application is in the keys
console.log("\n4. Checking for Application in keys:");
console.log("   Has Application key:", keys.includes("Application"));
console.log("   Has application key:", keys.includes("application"));

// Let's also check the models directory to see what's there
console.log("\n5. For comparison, let's check what works:");
console.log("   PrismaExport.Tenant:", typeof PrismaExport.Tenant);
if (PrismaExport.Tenant) {
  console.log("   PrismaExport.Tenant.findMany:", typeof PrismaExport.Tenant.findMany);
}