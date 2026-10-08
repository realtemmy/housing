import * as PrismaNamespace from "./src/generated/prisma/internal/prismaNamespace";

// Test accessing model methods from the Prisma namespace
console.log("=== Testing Prisma namespace model access ===");

console.log("\nChecking Application model in Prisma namespace:");
console.log("  PrismaNamespace.Application:", typeof PrismaNamespace.Application);
if (PrismaNamespace.Application) {
  console.log("  PrismaNamespace.Application.findMany:", typeof PrismaNamespace.Application.findMany);
  console.log("  PrismaNamespace.Application.create:", typeof PrismaNamespace.Application.create);
  console.log("  PrismaNamespace.Application.findUnique:", typeof PrismaNamespace.Application.findUnique);
}

console.log("\nChecking Tenant model in Prisma namespace (for comparison):");
console.log("  PrismaNamespace.Tenant:", typeof PrismaNamespace.Tenant);
if (PrismaNamespace.Tenant) {
  console.log("  PrismaNamespace.Tenant.findMany:", typeof PrismaNamespace.Tenant.findMany);
  console.log("  PrismaNamespace.Tenant.create:", typeof PrismaNamespace.Tenant.create);
}

console.log("\nChecking Lease model in Prisma namespace:");
console.log("  PrismaNamespace.Lease:", typeof PrismaNamespace.Lease);
if (PrismaNamespace.Lease) {
  console.log("  PrismaNamespace.Lease.findMany:", typeof PrismaNamespace.Lease.findMany);
  console.log("  PrismaNamespace.Lease.create:", typeof PrismaNamespace.Lease.create);
}