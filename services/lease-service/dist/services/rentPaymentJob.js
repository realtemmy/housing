"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const lease_service_1 = __importDefault(require("./lease.service"));
/**
 * Rent Payment Job Service
 * Handles scheduled processing of recurring rent payments
 */
class RentPaymentJob {
    constructor() {
        this.isRunning = false;
        this.job = null;
    }
    /**
     * Start the rent payment job
     * @param cronExpression Cron expression for when to run (default: daily at 2:00 AM)
     */
    start(cronExpression = "0 2 * * *") {
        if (this.isRunning) {
            console.warn("Rent payment job is already running");
            return;
        }
        console.log(`Starting rent payment job with cron expression: ${cronExpression}`);
        this.job = node_cron_1.default.schedule(cronExpression, async () => {
            console.log("Rent payment job started");
            try {
                await this.processRentPayments();
                console.log("Rent payment job completed successfully");
            }
            catch (error) {
                console.error("Error in rent payment job:", error);
            }
        });
        this.isRunning = true;
        console.log("Rent payment job started successfully");
    }
    /**
     * Stop the rent payment job
     */
    stop() {
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
    async processRentPayments() {
        try {
            console.log("Processing recurring rent payments...");
            await lease_service_1.default.processRecurringRent();
            console.log("Finished processing recurring rent payments");
        }
        catch (error) {
            console.error("Error processing recurring rent payments:", error);
            throw error;
        }
    }
    /**
     * Run the job once immediately (for testing or manual triggering)
     */
    async runOnce() {
        console.log("Running rent payment job once");
        try {
            await this.processRentPayments();
            console.log("Completed one-time rent payment job run");
        }
        catch (error) {
            console.error("Error in one-time rent payment job run:", error);
            throw error;
        }
    }
    /**
     * Check if the job is currently running
     */
    isJobRunning() {
        return this.isRunning;
    }
}
exports.default = new RentPaymentJob();
