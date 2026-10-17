import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { disconnectPrisma } from "../src/lib/db";
import { seed } from "../src/prisma/seed";

describe("DirectKey Maintenance & No-Key-No-Pay Handover Suite", () => {
  const client = new TestClient();
  let landlordToken: string;
  let tenantToken: string;
  let propertyId: string;
  let tenancyId: string;
  let handoverId: string;
  let releaseOtp: string;

  before(async () => {
    await seed();
    await client.start();

    // Login landlord
    const landRes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    landlordToken = landRes.body.data.accessToken;

    // Login tenant (Chioma who has the active tenancy on Flat 2B)
    const tenRes = await client.post("/api/v1/auth/login", {
      email: "chioma.eze@gmail.com",
      password: "Password123!",
    });
    tenantToken = tenRes.body.data.accessToken;

    // Get active tenancy
    const tRes = await client.get("/api/v1/tenancies", { token: tenantToken });
    tenancyId = tRes.body.items[0].id;
    propertyId = tRes.body.items[0].propertyId;
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  it("should create, comment, and update a physical maintenance request", async () => {
    // 1. Tenant submits maintenance request
    const reqRes = await client.post(
      "/api/v1/maintenance",
      {
        propertyId,
        tenancyId,
        title: "AC servicing required in master bedroom",
        description: "The inverter split AC is blowing warm air instead of cold air.",
        category: "APPLIANCE",
        urgency: "HIGH",
        accessPreference: "Morning before 11 AM",
      },
      { token: tenantToken }
    );

    assert.strictEqual(reqRes.status, 201);
    const requestId = reqRes.body.data.id;
    assert.strictEqual(reqRes.body.data.status, "SUBMITTED");

    // 2. Tenant adds a comment
    const commentRes = await client.post(
      `/api/v1/maintenance/${requestId}/comments`,
      { message: "The technician can call my mobile before arriving." },
      { token: tenantToken }
    );
    assert.strictEqual(commentRes.status, 201);

    // 3. Landlord updates status to SCHEDULED with cost estimate
    const updateRes = await client.patch(
      `/api/v1/maintenance/${requestId}/status`,
      {
        status: "SCHEDULED",
        estimatedCost: 35000,
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        note: "Assigned to Certified HVAC Contractor Daikin Lagos",
      },
      { token: landlordToken }
    );
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.data.status, "SCHEDULED");
  });

  it("should schedule a Move-In Handover inspection and generate release OTP", async () => {
    const handoverRes = await client.post(
      "/api/v1/handovers",
      {
        tenancyId,
        type: "MOVE_IN",
        scheduledDate: new Date().toISOString(),
        notes: "Move-in key exchange and inspection checklist",
        items: [
          { area: "Front Entrance", item: "Smart lock & brass keys", condition: "PASS" },
          { area: "Kitchen", item: "Gas pressure & cooker hood", condition: "PASS" },
        ],
      },
      { token: landlordToken }
    );

    assert.strictEqual(handoverRes.status, 201);
    handoverId = handoverRes.body.data.id;
    releaseOtp = handoverRes.body.data.releaseOtp;
    assert.ok(releaseOtp);
    assert.strictEqual(releaseOtp.length, 6);
  });

  it("should complete handover via dual OTP release and activate lease (NO KEY, NO PAY)", async () => {
    // 1. Confirm landlord inspection
    const landConfirm = await client.post(
      `/api/v1/handovers/${handoverId}/confirm/landlord`,
      {},
      { token: landlordToken }
    );
    assert.strictEqual(landConfirm.status, 200);

    // 2. Reject incorrect OTP
    const badOtpRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: "000000" },
      { token: tenantToken }
    );
    assert.strictEqual(badOtpRes.status, 400);

    // 3. Complete handover with verified 6-digit release OTP
    const completeRes = await client.post(
      `/api/v1/handovers/${handoverId}/complete`,
      { otp: releaseOtp },
      { token: tenantToken }
    );

    assert.strictEqual(completeRes.status, 200);
    assert.strictEqual(completeRes.body.data.status, "COMPLETED");

    // 4. Verify Tenancy is ACTIVE
    const tenancyCheck = await client.get(`/api/v1/tenancies/${tenancyId}`, { token: tenantToken });
    assert.strictEqual(tenancyCheck.body.data.status, "ACTIVE");
    assert.ok(tenancyCheck.body.data.actualHandoverDate);
  });
});
