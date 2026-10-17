import { getPrismaClient, disconnectPrisma } from "../lib/db";
import { AuthUtil } from "../lib/auth";
import { logger } from "../lib/logger";
import {
  UserRole,
  PropertyType,
  VerificationStatus,
  InventoryStatus,
  ListingStatus,
  BillingFrequency,
  TenancyStatus,
  ObligationType,
  ObligationStatus,
  PaymentMethod,
  PaymentVerificationStatus,
  AgreementStatus,
  HandoverType,
  HandoverStatus,
  ConditionRating,
  ItemCondition,
  VerificationCaseStatus,
  VerificationCaseCategory,
} from "../generated/prisma/client";

export async function seed() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error("Seeding with default mock credentials is prohibited in production! Set ALLOW_PRODUCTION_SEED=true to override.");
  }

  logger.info("Starting DirectKey realistic Lagos database seeding...");
  const prisma = await getPrismaClient();

  // 1. Seed Users
  const defaultPassword = "Password123!";
  const passwordHash = await AuthUtil.hashPassword(defaultPassword);

  const admin = await prisma.user.upsert({
    where: { email: "admin@directkey.ng" },
    update: {},
    create: {
      email: "admin@directkey.ng",
      passwordHash,
      firstName: "DirectKey",
      lastName: "SuperAdmin",
      phone: "+2348010000001",
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });

  const landlordFemi = await prisma.user.upsert({
    where: { email: "femi.okonkwo@lagosprime.com" },
    update: {},
    create: {
      email: "femi.okonkwo@lagosprime.com",
      passwordHash,
      firstName: "Femi",
      lastName: "Okonkwo",
      phone: "+2348020000002",
      role: UserRole.LANDLORD,
      status: "ACTIVE",
    },
  });

  const landlordKemi = await prisma.user.upsert({
    where: { email: "kemi.balogun@propertyng.com" },
    update: {},
    create: {
      email: "kemi.balogun@propertyng.com",
      passwordHash,
      firstName: "Kemi",
      lastName: "Balogun",
      phone: "+2348030000003",
      role: UserRole.LANDLORD,
      status: "ACTIVE",
    },
  });

  const agentTunde = await prisma.user.upsert({
    where: { email: "tunde.bakare@keypointagents.ng" },
    update: {},
    create: {
      email: "tunde.bakare@keypointagents.ng",
      passwordHash,
      firstName: "Tunde",
      lastName: "Bakare",
      phone: "+2348040000004",
      role: UserRole.AGENT,
      status: "ACTIVE",
    },
  });

  const tenantOlumide = await prisma.user.upsert({
    where: { email: "olumide.adebayo@gmail.com" },
    update: {},
    create: {
      email: "olumide.adebayo@gmail.com",
      passwordHash,
      firstName: "Olumide",
      lastName: "Adebayo",
      phone: "+2348050000005",
      role: UserRole.TENANT,
      status: "ACTIVE",
    },
  });

  const tenantChioma = await prisma.user.upsert({
    where: { email: "chioma.eze@gmail.com" },
    update: {},
    create: {
      email: "chioma.eze@gmail.com",
      passwordHash,
      firstName: "Chioma",
      lastName: "Eze",
      phone: "+2348060000006",
      role: UserRole.TENANT,
      status: "ACTIVE",
    },
  });

  logger.info("Users seeded successfully.");

  // 2. Seed Lekki Peninsula Property
  const lekkiProperty = await prisma.property.create({
    data: {
      ownerId: landlordFemi.id,
      title: "Lekki Peninsula Luxury Residences",
      description: "Serviced luxury waterfront apartments with 24/7 power, swimming pool, and high security in Lekki Phase 1.",
      propertyType: PropertyType.APARTMENT,
      addressStreet: "14 Admiralty Way",
      area: "Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
      latitude: 6.4474,
      longitude: 3.4739,
      verificationStatus: VerificationStatus.VERIFIED,
      isActive: true,
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
            category: "PHOTO",
            caption: "Exterior facade and waterfront lagoon view",
            isCover: true,
          },
          {
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            category: "PHOTO",
            caption: "Living room and high-end furnishings",
            isCover: false,
          },
        ],
      },
    },
  });

  // Building & Units
  const blockA = await prisma.building.create({
    data: {
      propertyId: lekkiProperty.id,
      name: "Block A - Atlantic Wing",
      floors: 5,
    },
  });

  const unitPenthouse = await prisma.unit.create({
    data: {
      propertyId: lekkiProperty.id,
      buildingId: blockA.id,
      unitNumber: "Penthouse 4A",
      floor: 4,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2400,
      rentAmount: 12000000,
      cautionDeposit: 1200000,
      serviceCharge: 1800000,
      status: InventoryStatus.AVAILABLE,
    },
  });

  const unitFlat2B = await prisma.unit.create({
    data: {
      propertyId: lekkiProperty.id,
      buildingId: blockA.id,
      unitNumber: "Flat 2B",
      floor: 2,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1500,
      rentAmount: 7500000,
      cautionDeposit: 750000,
      serviceCharge: 1200000,
      status: InventoryStatus.OCCUPIED,
    },
  });

  // 3. Seed Yaba Co-Living Hostel
  const yabaProperty = await prisma.property.create({
    data: {
      ownerId: landlordKemi.id,
      title: "Yaba Tech Student & Creative Co-Living Lodge",
      description: "Dedicated co-living housing for software developers, university students, and creatives near Herbert Macaulay Way.",
      propertyType: PropertyType.HOSTEL,
      addressStreet: "28 Commercial Avenue, Sabo",
      area: "Yaba",
      city: "Lagos",
      state: "Lagos",
      latitude: 6.5158,
      longitude: 3.3773,
      verificationStatus: VerificationStatus.VERIFIED,
      isActive: true,
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
            category: "PHOTO",
            caption: "Co-living community study room and workstations",
            isCover: true,
          },
        ],
      },
    },
  });

  const hostelUnit = await prisma.unit.create({
    data: {
      propertyId: yabaProperty.id,
      unitNumber: "Wing B - 2nd Floor",
      bedrooms: 4,
      bathrooms: 2,
      rentAmount: 1800000,
      cautionDeposit: 150000,
      status: InventoryStatus.AVAILABLE,
    },
  });

  const hostelRoom = await prisma.room.create({
    data: {
      propertyId: yabaProperty.id,
      unitId: hostelUnit.id,
      name: "Room 201 - Ensuite Dorm",
      type: "Dormitory",
      rentAmount: 850000,
      cautionDeposit: 80000,
      status: InventoryStatus.AVAILABLE,
    },
  });

  const bedA = await prisma.bed.create({
    data: {
      propertyId: yabaProperty.id,
      roomId: hostelRoom.id,
      label: "Bed 1 (Lower Bunk)",
      rentAmount: 450000,
      cautionDeposit: 45000,
      status: InventoryStatus.AVAILABLE,
    },
  });

  const bedB = await prisma.bed.create({
    data: {
      propertyId: yabaProperty.id,
      roomId: hostelRoom.id,
      label: "Bed 2 (Upper Bunk)",
      rentAmount: 400000,
      cautionDeposit: 40000,
      status: InventoryStatus.AVAILABLE,
    },
  });

  // 4. Agent Assignment
  await prisma.agentAssignment.create({
    data: {
      propertyId: lekkiProperty.id,
      agentId: agentTunde.id,
      assignedById: landlordFemi.id,
      canManageListings: true,
      canManageApplications: true,
      canManageMaintenance: true,
      canRecordPayments: true,
      isActive: true,
    },
  });

  // 5. Verification Case
  await prisma.verificationCase.create({
    data: {
      propertyId: lekkiProperty.id,
      submittedById: landlordFemi.id,
      category: VerificationCaseCategory.COMBINED,
      evidenceUrls: ["https://docs.directkey.ng/evidence/c-of-o-lekki-4a.pdf"],
      meterNumber: "EKEDC-048821992",
      gpsLatitude: 6.4474,
      gpsLongitude: 3.4739,
      ownershipDocUrl: "https://docs.directkey.ng/evidence/governor-consent-lekki.pdf",
      status: VerificationCaseStatus.APPROVED,
      reviewedById: admin.id,
      decisionNotes: "Verified original Lagos State Land Registry Governor's Consent and smart meter geolocation match.",
      verifiedAt: new Date(),
    },
  });

  // 6. Public Marketplace Listings
  const listingPenthouse = await prisma.listing.create({
    data: {
      propertyId: lekkiProperty.id,
      unitId: unitPenthouse.id,
      headline: "Exquisite 3-Bedroom Penthouse in Lekki Phase 1 with Panoramic Lagoon View",
      description: "Magnificent luxury penthouse featuring 24/7 power, high ceilings, ensuite bedrooms, fitted Italian kitchen, and private terrace.",
      displayPrice: 12000000,
      cautionDeposit: 1200000,
      serviceCharge: 1800000,
      billingFrequency: BillingFrequency.ANNUAL,
      amenities: ["24/7 Power", "Fibre Internet", "Swimming Pool", "Gym", "Lagoon View", "CCTV", "Dedicated Parking"],
      photos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      ],
      status: ListingStatus.PUBLISHED,
      isFeatured: true,
    },
  });

  const listingHostelBed = await prisma.listing.create({
    data: {
      propertyId: yabaProperty.id,
      unitId: hostelUnit.id,
      roomId: hostelRoom.id,
      bedId: bedA.id,
      headline: "Modern Co-Living Bed Space in Yaba near Tech Ecosystem Hubs",
      description: "All-inclusive co-living space for developers, students, and founders in Sabo Yaba. Includes 24/7 inverter solar backup, high-speed Starlink internet, study desk, and communal kitchen.",
      displayPrice: 450000,
      cautionDeposit: 45000,
      serviceCharge: 0,
      billingFrequency: BillingFrequency.ANNUAL,
      amenities: ["Solar Inverter Power", "Starlink WiFi", "Coworking Space", "Water Treatment", "Security Guard"],
      photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"],
      status: ListingStatus.PUBLISHED,
    },
  });

  // 7. Active Tenancy with Chioma Eze on Flat 2B
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const tenancy = await prisma.tenancy.create({
    data: {
      propertyId: lekkiProperty.id,
      unitId: unitFlat2B.id,
      tenantId: tenantChioma.id,
      landlordId: landlordFemi.id,
      startDate,
      endDate,
      propertyReadyDate: startDate,
      actualHandoverDate: startDate,
      commencementDate: startDate,
      rentAmount: 7500000,
      cautionDeposit: 750000,
      serviceCharge: 1200000,
      billingFrequency: BillingFrequency.ANNUAL,
      rentDueDay: 1,
      status: TenancyStatus.ACTIVE,
    },
  });

  // Payment instructions for this tenancy
  await prisma.paymentInstruction.create({
    data: {
      tenancyId: tenancy.id,
      bankName: "Guaranty Trust Bank (GTBank)",
      accountNumber: "0123456789",
      accountName: "Femi Okonkwo Property Account",
      instructions: "Direct bank transfer only. Use reference DK-TEN-LEKKI2B on the bank narration.",
      referenceTemplate: "DK-TEN-LEKKI2B",
      isActive: true,
    },
  });

  // Initial Rent Obligations
  const rentObligation = await prisma.rentObligation.create({
    data: {
      tenancyId: tenancy.id,
      obligationType: ObligationType.RENT,
      description: "First Year Rent",
      periodStart: startDate,
      periodEnd: endDate,
      amountDue: 7500000,
      amountPaid: 7500000,
      balanceRemaining: 0,
      dueDate: startDate,
      status: ObligationStatus.PAID,
    },
  });

  await prisma.rentObligation.create({
    data: {
      tenancyId: tenancy.id,
      obligationType: ObligationType.CAUTION_DEPOSIT,
      description: "Security/Caution Deposit",
      periodStart: startDate,
      periodEnd: endDate,
      amountDue: 750000,
      amountPaid: 750000,
      balanceRemaining: 0,
      dueDate: startDate,
      status: ObligationStatus.PAID,
    },
  });

  // Verified Payment Record
  await prisma.paymentRecord.create({
    data: {
      tenancyId: tenancy.id,
      obligationId: rentObligation.id,
      recordedById: tenantChioma.id,
      amount: 7500000,
      currency: "NGN",
      paymentDate: startDate,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      bankName: "GTBank",
      accountNumber: "0123456789",
      providerReference: "GTB-TRX-948190248",
      evidenceUrl: "https://docs.directkey.ng/receipts/chioma-first-year-rent.pdf",
      verificationStatus: PaymentVerificationStatus.VERIFIED,
      verifiedById: landlordFemi.id,
      verifiedAt: startDate,
    },
  });

  // Digital Tenancy Agreement
  await prisma.tenancyAgreement.create({
    data: {
      tenancyId: tenancy.id,
      version: 1,
      termsContent: "Standard Lagos State Tenancy Law Compliant Residential Lease Agreement for Flat 2B, Lekki Peninsula Luxury Residences.",
      documentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: AgreementStatus.FULLY_EXECUTED,
      tenantSignedAt: startDate,
      tenantSignIp: "102.89.23.45",
      landlordSignedAt: startDate,
      landlordSignIp: "105.112.98.12",
    },
  });

  // Move-in Handover with OTP ("NO KEY, NO PAY")
  await prisma.handoverInspection.create({
    data: {
      tenancyId: tenancy.id,
      type: HandoverType.MOVE_IN,
      scheduledDate: startDate,
      completedDate: startDate,
      tenantConfirmed: true,
      tenantConfirmedAt: startDate,
      landlordConfirmed: true,
      landlordConfirmedAt: startDate,
      keysHandedCount: 4,
      meterReadings: {
        electricityPrepaidMeter: "44019284129 - Balance: 154.2 kWh",
        waterMeter: "00182 m3",
      },
      overallCondition: ConditionRating.EXCELLENT,
      status: HandoverStatus.COMPLETED,
      releaseOtp: "847291",
      notes: "Full physical inspection completed. Keys transferred in person at property.",
      items: {
        create: [
          { area: "Living Room", item: "Walls and Paint", condition: ItemCondition.PASS },
          { area: "Living Room", item: "Air Conditioner & Remote", condition: ItemCondition.PASS },
          { area: "Kitchen", item: "Gas Burner & Heat Extractor", condition: ItemCondition.PASS },
          { area: "Master Bedroom", item: "Door Locks & 2 Keys", condition: ItemCondition.PASS },
        ],
      },
    },
  });

  logger.info("DirectKey database seeding completed successfully!");
}

if (require.main === module) {
  seed()
    .then(async () => {
      await disconnectPrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error("Seeding failed", err);
      await disconnectPrisma();
      process.exit(1);
    });
}
