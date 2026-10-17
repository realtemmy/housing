import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { disconnectPrisma } from "../src/lib/db";
import { seed } from "../src/prisma/seed";

describe("DirectKey Tenancy, Agreements & Non-Escrow Payments Suite", () => {
  const client = new TestClient();
  let landlordToken: string;
  let tenantToken: string;
  let propertyId: string;
  let tenantId: string;
  let tenancyId: string;
  let obligationId: string;
  let paymentRecordId: string;

  before(async () => {
    await seed();
    await client.start();

    // Login landlord
    const landRes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    landlordToken = landRes.body.data.accessToken;

    // Login tenant (Olumide)
    const tenRes = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    tenantToken = tenRes.body.data.accessToken;
    tenantId = tenRes.body.data.user.id;

    // Get Lekki property
    const propRes = await client.get("/api/v1/properties", { query: { area: "Lekki" } });
    propertyId = propRes.body.items[0].id;
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  it("should create a new tenancy with automated rent obligations", async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const tenancyRes = await client.post(
      "/api/v1/tenancies",
      {
        propertyId,
        tenantId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        rentAmount: 10000000,
        cautionDeposit: 1000000,
        serviceCharge: 1500000,
        billingFrequency: "ANNUAL",
        rentDueDay: 1,
      },
      { token: landlordToken }
    );

    assert.strictEqual(tenancyRes.status, 201);
    assert.strictEqual(tenancyRes.body.success, true);
    tenancyId = tenancyRes.body.data.id;
    assert.strictEqual(tenancyRes.body.data.status, "PENDING");

    // Fetch tenancy ledger
    const ledgerRes = await client.get(`/api/v1/payments/ledger/${tenancyId}`, { token: tenantToken });
    assert.strictEqual(ledgerRes.status, 200);
    assert.strictEqual(ledgerRes.body.data.obligations.length, 3); // Rent, Caution, Service Charge
    obligationId = ledgerRes.body.data.obligations[0].id;
    assert.strictEqual(ledgerRes.body.data.summary.totalDue, 12500000);
  });

  it("should set payment instructions for the tenant", async () => {
    const insRes = await client.post(
      "/api/v1/payments/instructions",
      {
        tenancyId,
        bankName: "Zenith Bank",
        accountNumber: "1012345678",
        accountName: "Lagos Prime Residences Ltd",
        instructions: "Transfer to Zenith Bank corporate account using your tenancy code as reference.",
      },
      { token: landlordToken }
    );

    assert.strictEqual(insRes.status, 201);
    assert.strictEqual(insRes.body.data.bankName, "Zenith Bank");
  });

  it("should allow tenant to report payment evidence and landlord to verify (NO ESCROW)", async () => {
    // 1. Tenant reports bank transfer payment
    const reportRes = await client.post(
      "/api/v1/payments/records",
      {
        tenancyId,
        obligationId,
        amount: 10000000,
        paymentDate: new Date().toISOString(),
        paymentMethod: "BANK_TRANSFER",
        bankName: "Zenith Bank",
        accountNumber: "1012345678",
        providerReference: `ZENITH-NIP-${Date.now()}`,
        evidenceUrl: "https://docs.directkey.ng/receipts/zenith-transfer-slip.pdf",
        notes: "Paid first year rent via mobile banking app.",
      },
      { token: tenantToken }
    );

    assert.strictEqual(reportRes.status, 201);
    assert.strictEqual(reportRes.body.data.verificationStatus, "REPORTED");
    paymentRecordId = reportRes.body.data.id;

    // 2. Landlord verifies receipt in bank account
    const verifyRes = await client.patch(
      `/api/v1/payments/records/${paymentRecordId}/verify`,
      {
        status: "VERIFIED",
      },
      { token: landlordToken }
    );

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.data.verificationStatus, "VERIFIED");

    // 3. Verify ledger reflects paid obligation
    const ledgerRes = await client.get(`/api/v1/payments/ledger/${tenancyId}`, { token: tenantToken });
    const rentOb = ledgerRes.body.data.obligations.find((o: any) => o.id === obligationId);
    assert.strictEqual(rentOb.status, "PAID");
    assert.strictEqual(Number(rentOb.balanceRemaining), 0);
  });

  it("should generate and digitally execute a tenancy agreement", async () => {
    // 1. Create agreement draft
    const agrRes = await client.post(
      `/api/v1/tenancies/${tenancyId}/agreements`,
      {
        termsContent: "Residential Lease Agreement for Lagos Prime Residences. Parties: Landlord Femi Okonkwo and Tenant Olumide Adebayo. Terms: 12 months, rent N10m.",
      },
      { token: landlordToken }
    );

    assert.strictEqual(agrRes.status, 201);
    const agreementId = agrRes.body.data.id;
    assert.strictEqual(agrRes.body.data.status, "PENDING_SIGNATURES");
    assert.ok(agrRes.body.data.documentHash);

    // 2. Tenant signs
    const tSignRes = await client.post(
      `/api/v1/tenancies/agreements/${agreementId}/sign/tenant`,
      { signatureConfirmation: true },
      { token: tenantToken }
    );
    assert.strictEqual(tSignRes.status, 200);
    assert.strictEqual(tSignRes.body.data.status, "TENANT_SIGNED");

    // 3. Landlord counter-signs -> FULLY_EXECUTED
    const lSignRes = await client.post(
      `/api/v1/tenancies/agreements/${agreementId}/sign/landlord`,
      { signatureConfirmation: true },
      { token: landlordToken }
    );
    assert.strictEqual(lSignRes.status, 200);
    assert.strictEqual(lSignRes.body.data.status, "FULLY_EXECUTED");
  });
});
