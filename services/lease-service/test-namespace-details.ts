import * as PrismaNamespace from "./src/generated/prisma/internal/prismaNamespace";

// Test what's actually in the Prisma namespace
console.log("=== Checking Prisma namespace contents ===");

const keys = Object.keys(PrismaNamespace);
console.log(`Number of keys in PrismaNamespace: ${keys.length}`);

// Show first 30 keys
console.log(`First 30 keys: ${keys.slice(0, 30).join(', ')}`);

// Check for specific things we expect
console.log("\nChecking for expected items:");
console.log("  has 'Application' key:", keys.includes("Application"));
console.log("  has 'Tenant' key:", keys.includes("Tenant"));
console.log("  has 'Lease' key:", keys.includes("Lease"));
console.log("  has '$Utils' key:", keys.includes("$Utils"));
console.log("  has PrismaClient:", typeof PrismaNamespace.PrismaClient);

// Let's look at the structure to see where the model methods might be
console.log("\nLooking for model-related structures...");

// Check if there's a models property
if (PrismaNamespace.models) {
  console.log("  Found models property:", typeof PrismaNamespace.models);
  if (PrismaNamespace.models) {
    const modelKeys = Object.keys(PrismaNamespace.models);
    console.log(`  Model keys: ${modelKeys.join(', ')}`);
  }
}

// Check if there's a $Models property or similar
const modelRelatedKeys = keys.filter(key =>
  key.toLowerCase().includes('model') ||
  key.toLowerCase().includes('application') ||
  key.toLowerCase().includes('tenant') ||
  key.toLowerCase().includes('lease')
);
console.log(`\nModel-related keys: ${modelRelatedKeys.join(', ')}`);

// Let's see what's actually in the namespace by looking at some values
console.log("\nSample key-value pairs:");
for (let i = 0; i < Math.min(20, keys.length); i++) {
  const key = keys[i];
  const value = PrismaNamespace[key as keyof typeof PrismaNamespace];
  console.log(`  ${key}: ${typeof value} ${value !== null && typeof value === 'object' ? '(object)' : ''}`);
}