"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReservationCheckJob = exports.checkAndReleaseExpiredReservations = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../lib/prisma");
/**
 * Checks for reserved units, rooms, and beds whose reservation period has expired
 * (i.e. status === 'RESERVED' and reservedUntil <= current time)
 * and reverts their status back to 'AVAILABLE'.
 */
const checkAndReleaseExpiredReservations = async () => {
    try {
        const now = new Date();
        // 1. Revert expired Units
        const expiredUnits = await prisma_1.prisma.unit.updateMany({
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
        const expiredRooms = await prisma_1.prisma.room.updateMany({
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
        const expiredBeds = await prisma_1.prisma.bed.updateMany({
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
        const totalReleased = expiredUnits.count + expiredRooms.count + expiredBeds.count;
        if (totalReleased > 0) {
            console.log(`[Reservation Cleanup Job] Released ${totalReleased} expired reservation(s): ` +
                `${expiredUnits.count} unit(s), ${expiredRooms.count} room(s), ${expiredBeds.count} bed(s).`);
        }
    }
    catch (error) {
        console.error("❌ Error in reservation cleanup job:", error);
    }
};
exports.checkAndReleaseExpiredReservations = checkAndReleaseExpiredReservations;
/**
 * Starts the cron job running every 1 minute.
 */
const startReservationCheckJob = () => {
    console.log("⏰ Starting reservation cleanup cron job (runs every 1 minute)...");
    // Run once immediately on start
    (0, exports.checkAndReleaseExpiredReservations)();
    // Schedule cron job to run every minute
    const task = node_cron_1.default.schedule("*/1 * * * *", async () => {
        await (0, exports.checkAndReleaseExpiredReservations)();
    });
    return task;
};
exports.startReservationCheckJob = startReservationCheckJob;
exports.default = {
    start: exports.startReservationCheckJob,
    checkAndReleaseExpiredReservations: exports.checkAndReleaseExpiredReservations,
};
