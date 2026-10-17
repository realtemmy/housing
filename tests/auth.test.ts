import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { disconnectPrisma } from "../src/lib/db";
import { seed } from "../src/prisma/seed";

describe("DirectKey Auth & RBAC Suite", () => {
  const client = new TestClient();

  before(async () => {
    await seed();
    await client.start();
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  const uniqueEmail = `test.tenant.${Date.now()}@directkey.ng`;
  const uniquePhone = `+234809988${Math.floor(1000 + Math.random() * 9000)}`;

  it("should register a new tenant account successfully", async () => {
    const res = await client.post("/api/v1/auth/register", {
      email: uniqueEmail,
      password: "StrongPassword123!",
      firstName: "Test",
      lastName: "Tenant",
      phone: uniquePhone,
      role: "TENANT",
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.ok(res.body.data.refreshToken);
    assert.strictEqual(res.body.data.user.email, uniqueEmail);
    assert.strictEqual(res.body.data.user.role, "TENANT");
  });

  it("should reject duplicate registration with the same email", async () => {
    const res = await client.post("/api/v1/auth/register", {
      email: uniqueEmail,
      password: "AnotherPassword123!",
      firstName: "Duplicate",
      lastName: "User",
      phone: `+234809988${Math.floor(1000 + Math.random() * 9000)}`,
      role: "TENANT",
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, "CONFLICT");
  });

  it("should authenticate an existing user and return tokens", async () => {
    const res = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.strictEqual(res.body.data.user.email, "olumide.adebayo@gmail.com");
  });

  it("should reject invalid login credentials", async () => {
    const res = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "WrongPassword!",
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, "UNAUTHORIZED");
  });

  it("should fetch current user profile with valid token", async () => {
    const loginRes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    const token = loginRes.body.data.accessToken;

    const profileRes = await client.get("/api/v1/auth/me", { token });

    assert.strictEqual(profileRes.status, 200);
    assert.strictEqual(profileRes.body.data.email, "femi.okonkwo@lagosprime.com");
    assert.strictEqual(profileRes.body.data.role, "LANDLORD");
  });

  it("should enforce RBAC guards when non-agent tries agent route", async () => {
    const loginRes = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    const tenantToken = loginRes.body.data.accessToken;

    const res = await client.get("/api/v1/auth/agents/managed-properties", { token: tenantToken });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error.code, "FORBIDDEN");
  });
});
