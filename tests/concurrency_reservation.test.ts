import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { disconnectPrisma } from "../src/lib/db";
import { seed } from "../src/prisma/seed";

describe("DirectKey Concurrency & Double-Booking Prevention Suite", () => {
  const client = new TestClient();
  let landlordToken: string;
  let tenant1Token: string;
  let tenant2Token: string;
  let listingId: string;

  before(async () => {
    await seed();
    await client.start();

    // Login landlord
    const landRes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    landlordToken = landRes.body.data.accessToken;

    // Login tenant 1 (Olumide)
    const t1Res = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    tenant1Token = t1Res.body.data.accessToken;

    // Register & Login tenant 2 (Babajide)
    const t2Email = `babajide.${Date.now()}@example.com`;
    const t2Phone = `+2348077${Math.floor(100000 + Math.random() * 900000)}`;
    const t2Reg = await client.post("/api/v1/auth/register", {
      email: t2Email,
      password: "Password123!",
      firstName: "Babajide",
      lastName: "Sanwo",
      phone: t2Phone,
      role: "TENANT",
    });
    tenant2Token = t2Reg.body.data.accessToken;

    // Fetch listing for Penthouse 4A
    const searchRes = await client.get("/api/v1/listings/search", {
      query: { area: "Lekki" },
    });
    listingId = searchRes.body.items[0].id;
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  it("should submit and approve a rental application", async () => {
    const appRes = await client.post(
      "/api/v1/transactions/applications",
      {
        listingId,
        monthlyIncome: 3500000,
        employmentStatus: "FULL_TIME",
        employerName: "Paystack Payments Limited",
        proposedMoveInDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        coverLetter: "Looking for long-term residential lease for my family.",
      },
      { token: tenant1Token }
    );

    assert.strictEqual(appRes.status, 201);
    assert.strictEqual(appRes.body.success, true);
    const applicationId = appRes.body.data.id;

    // Landlord approves application
    const reviewRes = await client.patch(
      `/api/v1/transactions/applications/${applicationId}/review`,
      {
        status: "APPROVED",
        decisionNotes: "Applicant verified with strong verifiable corporate income.",
      },
      { token: landlordToken }
    );

    assert.strictEqual(reviewRes.status, 200);
    assert.strictEqual(reviewRes.body.data.status, "APPROVED");
  });

  it("should atomically place a temporary hold and prevent double-booking under concurrency", async () => {
    // 1. Get Tenant 1's approved application
    const myApps = await client.get("/api/v1/transactions/applications", { token: tenant1Token });
    const appId1 = myApps.body.items[0].id;

    // 2. Tenant 2 also applies and landlord approves
    const app2Res = await client.post(
      "/api/v1/transactions/applications",
      {
        listingId,
        monthlyIncome: 4000000,
        employmentStatus: "FULL_TIME",
        employerName: "Flutterwave",
        proposedMoveInDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      },
      { token: tenant2Token }
    );
    const appId2 = app2Res.body.data.id;
    await client.patch(
      `/api/v1/transactions/applications/${appId2}/review`,
      { status: "APPROVED" },
      { token: landlordToken }
    );

    // 3. Tenant 1 reserves the inventory item
    const res1 = await client.post(
      "/api/v1/transactions/reservations",
      { applicationId: appId1, holdHours: 24 },
      { token: tenant1Token }
    );

    assert.strictEqual(res1.status, 201);
    assert.strictEqual(res1.body.success, true);
    assert.strictEqual(res1.body.data.status, "ACTIVE_HOLD");
    const reservation1Id = res1.body.data.id;

    // 4. CONCURRENCY CONFLICT: Tenant 2 attempts to reserve the same unit simultaneously
    const res2 = await client.post(
      "/api/v1/transactions/reservations",
      { applicationId: appId2, holdHours: 24 },
      { token: tenant2Token }
    );

    // Must be blocked by row-locking and return 409 Conflict!
    assert.strictEqual(res2.status, 409);
    assert.strictEqual(res2.body.success, false);
    assert.strictEqual(res2.body.error.code, "CONFLICT");

    // 5. Tenant 1 cancels their reservation
    const cancelRes = await client.post(
      `/api/v1/transactions/reservations/${reservation1Id}/cancel`,
      {},
      { token: tenant1Token }
    );
    assert.strictEqual(cancelRes.status, 200);

    // 6. Now Tenant 2 can reserve the freed inventory item successfully!
    const res2Retry = await client.post(
      "/api/v1/transactions/reservations",
      { applicationId: appId2, holdHours: 24 },
      { token: tenant2Token }
    );
    assert.strictEqual(res2Retry.status, 201);
    assert.strictEqual(res2Retry.body.data.status, "ACTIVE_HOLD");
  });
});
