import { UnitType, AvailableStatus } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create a Property (The overarching entity)
  const property = await prisma.property.create({
    data: {
      title: "Sunshine Student Lodge",
      description: "Premium student accommodation near Unilag.",
      ownerId: "owner-user-123", // Mock Owner ID
      verified: true,
      isActive: true,
    },
  });

  console.log(`Created Property: ${property.title}`);

  // 2. Create the Hostel Building
  const hostel = await prisma.building.create({
    data: {
      name: "Block A - The Hive",
      description: "Main hostel block with shared amenities.",
      propertyId: property.id,
      floors: 2,
      address: {
        create: {
          street: "15 Akoka Road",
          city: "Yaba",
          state: "Lagos",
          postalCode: "100001",
          country: "Nigeria",
        },
      },
    },
  });

  console.log(`Created Building: ${hostel.name}`);

  // 3. Create a Unit (e.g., "Flat 1" on the ground floor)
  const flat1 = await prisma.unit.create({
    data: {
      unitNumber: "Flat 1",
      summary: "3-Bedroom Ground Floor Flat",
      floor: 0,
      bedrooms: 3,
      bathrooms: 2,
      type: UnitType.HOSTEL,
      buildingId: hostel.id,
      propertyId: property.id,
      status: AvailableStatus.AVAILABLE,
    },
  });

  console.log(`Created Unit: ${flat1.unitNumber}`);

  // 4. Create a Room (e.g., "Room A" inside Flat 1)
  const roomA = await prisma.room.create({
    data: {
      name: "Room A (Male Wing)",
      size: 200, // sqft
      unitId: flat1.id,
      propertyId: property.id,
      status: AvailableStatus.AVAILABLE,
    },
  });

  // 5. Create Beds (The actual rentable items)
  const bedsData = [
    { label: "Bunk 1 - Top", price: 150000, deposit: 20000 },
    { label: "Bunk 1 - Bottom", price: 180000, deposit: 20000 },
    { label: "Bunk 2 - Top", price: 150000, deposit: 20000 },
    { label: "Bunk 2 - Bottom", price: 180000, deposit: 20000 },
  ];

  for (const bed of bedsData) {
    await prisma.bed.create({
      data: {
        label: bed.label,
        rentAmount: bed.price,
        depositAmount: bed.deposit,
        status: AvailableStatus.AVAILABLE,
        roomId: roomA.id,
        propertyId: property.id,
      },
    });
  }

  console.log(`Created ${bedsData.length} beds in ${roomA.name}`);

  // 6. Create a Maintenance Request (Linked to the Unit)
  await prisma.maintenanceRequest.create({
    data: {
      title: "Broken Fan in Room A",
      description: "The ceiling fan in Room A is wobbling dangerous.",
      unitId: flat1.id,
      requesterId: "student-user-999",
      assigneeId: "admin-user-001",
      priority: 5,
      status: "OPEN",
    },
  });

  console.log("Created sample maintenance request.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
