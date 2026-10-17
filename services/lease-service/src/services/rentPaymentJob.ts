import cron from "node-cron";
import type { ScheduledTask } from "node-cron";
import leaseService from "./lease.service";

/**
 * Rent Payment Job Service
 * Handles scheduled processing of recurring rent payments
 */
class RentPaymentJob {
  private isRunning: boolean = false;
  private job: ScheduledTask | null = null;

  /**
   * Start the rent payment job
   * @param cronExpression Cron expression for when to run (default: daily at 2:00 AM)
   */
  start(cronExpression: string = "0 2 * * *"): void {
    if (this.isRunning) {
      console.warn("Rent payment job is already running");
      return;
    }

    console.log(`Starting rent payment job with cron expression: ${cronExpression}`);

    this.job = cron.schedule(cronExpression, async () => {
      console.log("Rent payment job started");
      try {
        await this.processRentPayments();
        console.log("Rent payment job completed successfully");
      } catch (error) {
        console.error("Error in rent payment job:", error);
      }
    });

    this.isRunning = true;
    console.log("Rent payment job started successfully");
  }

  /**
   * Stop the rent payment job
   */
  stop(): void {
    if (!this.isRunning || !this.job) {
      console.warn("Rent payment job is not running");
      return;
    }

    console.log("Stopping rent payment job");
    this.job.stop();
    this.job = null;
    this.isRunning = false;
    console.log("Rent payment job stopped");
  }

  /**
   * Process rent payments for all leases
   * This is the main logic that runs on schedule
   */
  async processRentPayments(): Promise<void> {
    try {
      console.log("Processing recurring rent payments...");
      await leaseService.processRecurringRent();
      console.log("Finished processing recurring rent payments");
    } catch (error) {
      console.error("Error processing recurring rent payments:", error);
      throw error;
    }
  }

  /**
   * Run the job once immediately (for testing or manual triggering)
   */
  async runOnce(): Promise<void> {
    console.log("Running rent payment job once");
    try {
      await this.processRentPayments();
      console.log("Completed one-time rent payment job run");
    } catch (error) {
      console.error("Error in one-time rent payment job run:", error);
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