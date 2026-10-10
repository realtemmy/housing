import cron from "node-cron";
import leaseService from "./lease.service";
import { logger } from "../utils/logger"; // Assuming we have a logger utility

/**
 * Rent Payment Job Service
 * Handles scheduled processing of recurring rent payments
 */
class RentPaymentJob {
  private isRunning: boolean = false;
  private job: cron.ScheduledTask | null = null;

  /**
   * Start the rent payment job
   * @param cronExpression Cron expression for when to run (default: daily at 2:00 AM)
   */
  start(cronExpression: string = "0 2 * * *"): void {
    if (this.isRunning) {
      logger.warn("Rent payment job is already running");
      return;
    }

    logger.info(`Starting rent payment job with cron expression: ${cronExpression}`);

    this.job = cron.schedule(cronExpression, async () => {
      logger.info("Rent payment job started");
      try {
        await this.processRentPayments();
        logger.info("Rent payment job completed successfully");
      } catch (error) {
        logger.error("Error in rent payment job:", error);
      }
    });

    this.isRunning = true;
    logger.info("Rent payment job started successfully");
  }

  /**
   * Stop the rent payment job
   */
  stop(): void {
    if (!this.isRunning || !this.job) {
      logger.warn("Rent payment job is not running");
      return;
    }

    logger.info("Stopping rent payment job");
    this.job.stop();
    this.job = null;
    this.isRunning = false;
    logger.info("Rent payment job stopped");
  }

  /**
   * Process rent payments for all leases
   * This is the main logic that runs on schedule
   */
  async processRentPayments(): Promise<void> {
    try {
      logger.info("Processing recurring rent payments...");
      await leaseService.processRecurringRent();
      logger.info("Finished processing recurring rent payments");
    } catch (error) {
      logger.error("Error processing recurring rent payments:", error);
      throw error;
    }
  }

  /**
   * Run the job once immediately (for testing or manual triggering)
   */
  async runOnce(): Promise<void> {
    logger.info("Running rent payment job once");
    try {
      await this.processRentPayments();
      logger.info("Completed one-time rent payment job run");
    } catch (error) {
      logger.error("Error in one-time rent payment job run:", error);
      throw error;
    }
  }

  /**
   * Check if the job is currently running
   */
  isJobRunning(): boolean {
    return this.isRunning;
  }
}

export default new RentPaymentJob();