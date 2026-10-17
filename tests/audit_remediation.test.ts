import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { seed } from "../src/prisma/seed";
import { disconnectPrisma, getPrismaClient } from "../src/lib/db";
import { InventoryStatus } from "../src/generated/prisma/client";

describe("DirectKey Production Audit Remediation & Hardening Suite", () => {
  const client = new TestClient();
  let landlordAToken: string;
  let landlordBToken: string;
  let tenantToken: string;
  let propertyAId: string;
  let unitAId: string;

  before(async () => {
    await seed();
    await client.start();

    // 1. Authenticate Landlord A (Femi Okonkwo - seeded)
    const landARes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    landlordAToken = landARes.body.data.accessToken;

    // 2. Register & Authenticate Landlord B (Attacker / Different Landlord)
    const landBEmail = `landlord.b.${Date.now()}@example.com`;
    const landBRes = await client.post("/api/v1/auth/register", {
      email: landBEmail,
      password: "Password123!",
      firstName: "Hostile",
      lastName: "Landlord",
      phone: `+2348033${Math.floor(100000 + Math.random() * 900000)}`,
      role: "LANDLORD",
    });
    landlordBToken = landBRes.body.data.accessToken;

    // 3. Authenticate Tenant (Olumide Adebayo - seeded)
    const tenantRes = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    tenantToken = tenantRes.body.data.accessToken;

    // 4. Create Property A owned by Landlord A
    const propRes = await client.post(
      "/api/v1/properties",
      {
        title: "Audit Test Villa - Banana Island",
        description: "Luxury private estate for security testing",
        propertyType: "APARTMENT",
        addressStreet: "5 Ocean Parade",
        area: "Ikoyi",
        city: "Lagos",
        state: "Lagos",
      },
      { token: landlordAToken }
    );
    propertyAId = propRes.body.data.id;

    // Create a Unit on Property A
    const unitRes = await client.post(
      `/api/v1/properties/${propertyAId}/units`,
      {
        unitNumber: "SUITE-99",
        bedrooms: 3,
        bathrooms: 3,
        rentAmount: 12000000,
        cautionDeposit: 1500000,
      },
      { token: landlordAToken }
    );
    unitAId = unitRes.body.data.id;
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  // --- REGRESSION 1: DEFECT 2 (Horizontal Privilege Escalation / BOLA) ---
  it("REGRESSION: should reject Landlord B modifying or deleting Landlord A's units", async () => {
    // Attempt to update Landlord A's unit using Landlord B's token
    const updateRes = await client.patch(
      `/api/v1/properties/units/${unitAId}`,
      { rentAmount: 1000 },
      { token: landlordBToken }
    );
    assert.strictEqual(updateRes.status, 403);
    assert.strictEqual(updateRes.body.success, false);
    assert.strictEqual(updateRes.body.error.code, "FORBIDDEN");

    // Attempt to delete Landlord A's unit using Landlord B's token
    const deleteRes = await client.delete(
      `/api/v1/properties/units/${unitAId}`,
      { token: landlordBToken }
    );
    assert.strictEqual(deleteRes.status, 403);
    assert.strictEqual(deleteRes.body.success, false);
    assert.strictEqual(deleteRes.body.error.code, "FORBIDDEN");
  });

  // --- REGRESSION 2: DEFECT 6 (Token Type Confusion Prevention) ---
  it("REGRESSION: should reject refresh token used as Bearer access token", async () => {
    const loginRes = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    const refreshToken = loginRes.body.data.refreshToken;
    const accessToken = loginRes.body.data.accessToken;

    // Attempt to use refresh token on a protected endpoint
    const meRes = await client.get("/api/v1/auth/me", {
      token: refreshToken,
    });
    assert.strictEqual(meRes.status, 401);
    assert.strictEqual(meRes.body.success, false);

    // Attempt to use access token on the refresh endpoint
    const refreshRes = await client.post("/api/v1/auth/refresh", {
      refreshToken: accessToken,
    });
    assert.strictEqual(refreshRes.status, 401);
    assert.strictEqual(refreshRes.body.success, false);
  });

  // --- REGRESSION 3: DEFECT 4 (Payment Replay & Duplicate Reference) ---
  it("REGRESSION: should reject duplicate payment reference and prevent double-crediting", async () => {
    const prisma = await getPrismaClient();

    // Fetch an existing tenancy with its tenant
    const tenancy = await prisma.tenancy.findFirst({
      where: { status: "ACTIVE" },
      include: { tenant: true, obligations: true },
    });
    assert.ok(tenancy, "Active tenancy must exist from seed");

    const tenantLogin = await client.post("/api/v1/auth/login", {
      email: tenancy.tenant.email,
      password: "Password123!",
    });
    const actualTenantToken = tenantLogin.body.data.accessToken;

    const uniqueRef = `REPLAY-TEST-${Date.now()}`;

    // 1. Tenant reports payment (created as REPORTED)
    const report1 = await client.post(
      "/api/v1/payments/records",
      {
        tenancyId: tenancy.id,
        amount: 500000,
        paymentDate: new Date().toISOString(),
        paymentMethod: "BANK_TRANSFER",
        providerReference: uniqueRef,
        evidenceUrl: "https://docs.directkey.ng/receipts/slip.pdf",
      },
      { token: actualTenantToken }
    );
    assert.strictEqual(report1.status, 201);
    assert.strictEqual(report1.body.data.verificationStatus, "REPORTED");
    const paymentRecordId = report1.body.data.id;

    // 2. Duplicate reference must be rejected with 409 CONFLICT
    const report2 = await client.post(
      "/api/v1/payments/records",
      {
        tenancyId: tenancy.id,
        amount: 500000,
        paymentDate: new Date().toISOString(),
        paymentMethod: "BANK_TRANSFER",
        providerReference: uniqueRef,
        evidenceUrl: "https://docs.directkey.ng/receipts/slip2.pdf",
      },
      { token: actualTenantToken }
    );
    assert.strictEqual(report2.status, 409);
    assert.strictEqual(report2.body.error.code, "CONFLICT");

    // 3. Verify payment once
    const verify1 = await client.patch(
      `/api/v1/payments/records/${paymentRecordId}/verify`,
      { status: "VERIFIED" },
      { token: landlordAToken }
    );
    assert.strictEqual(verify1.status, 200);

    // 4. Re-verifying must be rejected with 409 CONFLICT (no double credit)
    const verify2 = await client.patch(
      `/api/v1/payments/records/${paymentRecordId}/verify`,
      { status: "VERIFIED" },
      { token: landlordAToken }
    );
    assert.strictEqual(verify2.status, 409);
    assert.strictEqual(verify2.body.error.code, "CONFLICT");
  });

  // --- REGRESSION 4: DEFECT 5 (Reservation State & Maintenance Status Guard) ---
  it("REGRESSION: should reject reservation holds on units under MAINTENANCE", async () => {
    const prisma = await getPrismaClient();

    // Mark unit as MAINTENANCE
    await prisma.unit.update({
      where: { id: unitAId },
      data: { status: InventoryStatus.MAINTENANCE },
    });

    // Create a listing for this unit
    const listing = await prisma.listing.create({
      data: {
        propertyId: propertyAId,
        unitId: unitAId,
        headline: "Luxury Suite undergoing maintenance",
        description: "Test description for maintenance listing",
        displayPrice: 12000000,
        cautionDeposit: 1500000,
        status: "PUBLISHED",
      },
    });

    // Submit and approve application
    const tenantUser = await prisma.user.findFirst({ where: { role: "TENANT" } });
    const app = await prisma.application.create({
      data: {
        listingId: listing.id,
        applicantId: tenantUser!.id,
        status: "APPROVED",
        monthlyIncome: 4000000,
        employmentStatus: "FULL_TIME",
        employerName: "DirectKey Test Corp",
        proposedMoveInDate: new Date(),
      },
    });

    // Attempt reservation hold on MAINTENANCE unit
    const holdRes = await client.post(
      "/api/v1/transactions/reservations",
      {
        applicationId: app.id,
        holdHours: 48,
      },
      { token: tenantToken }
    );

    assert.strictEqual(holdRes.status, 409);
    assert.strictEqual(holdRes.body.error.code, "CONFLICT");
    assert.match(holdRes.body.error.message, /not available for reservation/);
  });

  // --- REGRESSION 5: DEFECT 3 (Handover Security, Caller Check & Landlord Confirmation) ---
  it("REGRESSION: should enforce dual confirmation and reject unauthorized callers on handover OTP", async () => {
    const prisma = await getPrismaClient();

    const tenancy = await prisma.tenancy.findFirst({
      where: { status: "ACTIVE" },
      include: { tenant: true },
    });
    assert.ok(tenancy);

    const tenantLogin = await client.post("/api/v1/auth/login", {
      email: tenancy.tenant.email,
      password: "Password123!",
    });
    const actualTenantToken = tenantLogin.body.data.accessToken;

    // Schedule a handover
    const handoverRes = await client.post(
      "/api/v1/handovers",
      {
        tenancyId: tenancy.id,
        type: "MOVE_IN",
        scheduledDate: new Date().toISOString(),
      },
      { token: landlordAToken }
    );
    assert.strictEqual(handoverRes.status, 201);
    const handoverId = handoverRes.body.data.id;

    // Fetch the actual generated OTP directly from DB
    const handoverRecord = await prisma.handoverInspection.findUnique({
      where: { id: handoverId },
    });
    assert.ok(handoverRecord);
    const correctOtp = handoverRecord.releaseOtp;

    // 1. Unauthorized third party (Landlord B) tries to complete
    const unauthRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: correctOtp },
      { token: landlordBToken }
    );
    assert.strictEqual(unauthRes.status, 403);
    assert.strictEqual(unauthRes.body.error.code, "FORBIDDEN");

    // 2. Tenant tries to complete BEFORE landlord confirmation -> Must reject with 409
    const prematurelyRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: correctOtp },
      { token: actualTenantToken }
    );
    assert.strictEqual(prematurelyRes.status, 409);
    assert.strictEqual(prematurelyRes.body.error.code, "CONFLICT");
    assert.match(prematurelyRes.body.error.message, /landlord or agent/);

    // 3. Landlord confirms condition
    const confirmRes = await client.post(
      `/api/v1/handovers/${handoverId}/confirm/landlord`,
      {},
      { token: landlordAToken }
    );
    assert.strictEqual(confirmRes.status, 200);

    // 4. Invalid OTP attempt counter check
    const badOtpRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: "000000" },
      { token: actualTenantToken }
    );
    assert.strictEqual(badOtpRes.status, 400);
    assert.strictEqual(badOtpRes.body.error.code, "BAD_REQUEST");
    assert.match(badOtpRes.body.error.message, /attempts remaining/);

    // 5. Valid OTP completes the handover
    const successRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: correctOtp },
      { token: actualTenantToken }
    );
    assert.strictEqual(successRes.status, 200);
    assert.strictEqual(successRes.body.data.status, "COMPLETED");

    // 6. Already completed handover rejects duplicate completion
    const duplicateRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: correctOtp },
      { token: actualTenantToken }
    );
    assert.strictEqual(duplicateRes.status, 409);
  });
});
