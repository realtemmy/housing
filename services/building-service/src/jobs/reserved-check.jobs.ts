import cron from "node-cron";
import { prisma } from "../lib/prisma";

/**
 * Checks for reserved units, rooms, and beds whose reservation period has expired
 * (i.e. status === 'RESERVED' and reservedUntil <= current time)
 * and reverts their status back to 'AVAILABLE'.
 */
export const checkAndReleaseExpiredReservations = async () => {
  try {
    const now = new Date();

    // 1. Revert expired Units
    const expiredUnits = await prisma.unit.updateMany({
      where: {
        status: "RESERVED",
        reservedUntil: {
          lte: now,
        },
      },
      data: {
        status: "AVAILABLE",
        reservedAt: null,
        reservedUntil: null,
        depositAmount: null,
      },
    });

    // 2. Revert expired Rooms
    const expiredRooms = await prisma.room.updateMany({
      where: {
        status: "RESERVED",
        reservedUntil: {
          lte: now,
        },
      },
      data: {
        status: "AVAILABLE",
        reservedAt: null,
        reservedUntil: null,
        depositAmount: null,
      },
    });

    // 3. Revert expired Beds
    const expiredBeds = await prisma.bed.updateMany({
      where: {
        status: "RESERVED",
        reservedUntil: {
          lte: now,
        },
      },
      data: {
        status: "AVAILABLE",
        reservedAt: null,
        reservedUntil: null,
        depositAmount: null,
      },
    });

    const totalReleased =
      expiredUnits.count + expiredRooms.count + expiredBeds.count;

    if (totalReleased > 0) {
      console.log(
        `[Reservation Cleanup Job] Released ${totalReleased} expired reservation(s): ` +
          `${expiredUnits.count} unit(s), ${expiredRooms.count} room(s), ${expiredBeds.count} bed(s).`
      );
    }
  } catch (error) {
    console.error("❌ Error in reservation cleanup job:", error);
  }
};

/**
 * Starts the cron job running every 1 minute.
 */
export const startReservationCheckJob = () => {
  console.log("⏰ Starting reservation cleanup cron job (runs every 1 minute)...");
  
  // Run once immediately on start
  checkAndReleaseExpiredReservations();

  // Schedule cron job to run every minute
  const task = cron.schedule("*/1 * * * *", async () => {
    await checkAndReleaseExpiredReservations();
  });

  return task;
};

export default {
  start: startReservationCheckJob,
  checkAndReleaseExpiredReservations,
};