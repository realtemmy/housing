import cron from "node-cron";
import { getPrismaClient } from "./db";
import { logger } from "./logger";

export class BackgroundJobManager {
  private static tasks: ReturnType<typeof cron.schedule>[] = [];

  /**
   * Start scheduled background tasks
   */
  static start(): void {
    logger.info("Starting background job workers...");

    // 1. Release expired reservations every 60 seconds
    const reservationCleanup = cron.schedule("*/1 * * * *", async () => {
      try {
        const prisma = await getPrismaClient();
        const now = new Date();

        // Find active holds that have passed expiration
        const expired = await prisma.reservation.findMany({
          where: {
            status: "ACTIVE_HOLD",
            expiresAt: { lte: now },
          },
          include: {
            unit: true,
            room: true,
            bed: true,
          },
        });

        if (expired.length > 0) {
          logger.info(`Found ${expired.length} expired reservations to release`);

          for (const res of expired) {
            await prisma.$transaction(async (tx) => {
              // Update reservation to EXPIRED
              await tx.reservation.update({
                where: { id: res.id },
                data: { status: "EXPIRED" },
              });

              // Revert unit/room/bed inventory to AVAILABLE (WITHOUT wiping deposit amount!)
              if (res.unitId && res.unit?.status === "RESERVED") {
                await tx.unit.update({
                  where: { id: res.unitId },
                  data: { status: "AVAILABLE" },
                });
              }
              if (res.roomId && res.room?.status === "RESERVED") {
                await tx.room.update({
                  where: { id: res.roomId },
                  data: { status: "AVAILABLE" },
                });
              }
              if (res.bedId && res.bed?.status === "RESERVED") {
                await tx.bed.update({
                  where: { id: res.bedId },
                  data: { status: "AVAILABLE" },
                });
              }

              // Create notification for tenant
              await tx.notification.create({
                data: {
                  recipientId: res.tenantId,
                  title: "Reservation Expired",
                  message: "Your temporary reservation hold has expired because payment was not completed in time.",
                  type: "SYSTEM",
                },
              });
            });
          }
        }
      } catch (err: any) {
        logger.error("Error running reservation cleanup job", err);
      }
    });

    // 2. Daily check for overdue rent obligations (Runs at 00:05 UTC)
    const rentObligationCheck = cron.schedule("5 0 * * *", async () => {
      try {
        const prisma = await getPrismaClient();
        const now = new Date();

        const overdueCount = await prisma.rentObligation.updateMany({
          where: {
            status: "PENDING",
            dueDate: { lt: now },
            balanceRemaining: { gt: 0 },
          },
          data: {
            status: "OVERDUE",
          },
        });

        if (overdueCount.count > 0) {
          logger.info(`Updated ${overdueCount.count} rent obligations to OVERDUE`);
        }
      } catch (err: any) {
        logger.error("Error running rent obligation check job", err);
      }
    });

    this.tasks.push(reservationCleanup, rentObligationCheck);
  }

  static stop(): void {
    for (const task of this.tasks) {
      task.stop();
    }
    this.tasks = [];
    logger.info("Background jobs stopped");
  }
}
