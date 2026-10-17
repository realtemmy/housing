import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { TestClient } from "./test-client";
import { disconnectPrisma } from "../src/lib/db";
import { seed } from "../src/prisma/seed";

describe("DirectKey Property & Listings Suite", () => {
  const client = new TestClient();
  let landlordToken: string;
  let tenantToken: string;

  before(async () => {
    await seed();
    await client.start();

    // Login landlord
    const landRes = await client.post("/api/v1/auth/login", {
      email: "femi.okonkwo@lagosprime.com",
      password: "Password123!",
    });
    landlordToken = landRes.body.data.accessToken;

    // Login tenant
    const tenRes = await client.post("/api/v1/auth/login", {
      email: "olumide.adebayo@gmail.com",
      password: "Password123!",
    });
    tenantToken = tenRes.body.data.accessToken;
  });

  after(async () => {
    await client.stop();
    await disconnectPrisma();
  });

  it("should create a new property with units (conventional apartment hierarchy)", async () => {
    const propRes = await client.post(
      "/api/v1/properties",
      {
        title: "Victoria Island Executive Terraces",
        description: "Modern serviced terrace homes in Oniru/VI",
        propertyType: "TERRACE",
        addressStreet: "22 Water Corporation Road",
        area: "Victoria Island",
        city: "Lagos",
        state: "Lagos",
      },
      { token: landlordToken }
    );

    assert.strictEqual(propRes.status, 201);
    assert.strictEqual(propRes.body.success, true);
    const propertyId = propRes.body.data.id;

    // Add unit to property
    const unitRes = await client.post(
      `/api/v1/properties/${propertyId}/units`,
      {
        unitNumber: "House 3",
        bedrooms: 4,
        bathrooms: 4,
        rentAmount: 15000000,
        cautionDeposit: 1500000,
        serviceCharge: 2000000,
      },
      { token: landlordToken }
    );

    assert.strictEqual(unitRes.status, 201);
    assert.strictEqual(unitRes.body.data.unitNumber, "House 3");
  });

  it("should search marketplace listings with area and price filters", async () => {
    const res = await client.get("/api/v1/listings/search", {
      query: { area: "Lekki", minPrice: 5000000, maxPrice: 15000000 },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.items.length >= 1);
    assert.strictEqual(res.body.items[0].property.area, "Lekki Phase 1");
    assert.strictEqual(res.body.items[0].property.verificationStatus, "VERIFIED");
  });

  it("should allow a tenant to submit a viewing request", async () => {
    // Get published listing
    const searchRes = await client.get("/api/v1/listings/search", {
      query: { area: "Lekki" },
    });
    const listingId = searchRes.body.items[0].id;

    const viewingRes = await client.post(
      `/api/v1/listings/${listingId}/viewings`,
      {
        preferredDate: new Date(Date.now() + 86400000).toISOString(),
        contactPhone: "+2348050000005",
        notes: "I would like an evening viewing around 5 PM.",
      },
      { token: tenantToken }
    );

    assert.strictEqual(viewingRes.status, 201);
    assert.strictEqual(viewingRes.body.success, true);
    assert.strictEqual(viewingRes.body.data.status, "PENDING");
  });

  it("should allow a tenant to send an enquiry and host to respond", async () => {
    const searchRes = await client.get("/api/v1/listings/search", {
      query: { area: "Lekki" },
    });
    const listingId = searchRes.body.items[0].id;

    const enqRes = await client.post(
      `/api/v1/listings/${listingId}/enquiries`,
      {
        message: "Is the generator schedule 24/7 or 18 hours per day?",
      },
      { token: tenantToken }
    );

    assert.strictEqual(enqRes.status, 201);
    assert.strictEqual(enqRes.body.success, true);
    const enquiryId = enqRes.body.data.id;

    // Landlord responds
    const respondRes = await client.post(
      `/api/v1/listings/enquiries/${enquiryId}/respond`,
      {
        response: "Power is guaranteed 24/7 with dual industrial Cummins diesel generators and solar inverter backup.",
        status: "RESPONDED",
      },
      { token: landlordToken }
    );

    assert.strictEqual(respondRes.status, 200);
    assert.strictEqual(respondRes.body.data.status, "RESPONDED");
  });
});
