"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaService {
    constructor() {
        this.isConnected = false;
        this.kafka = new kafkajs_1.Kafka({
            clientId: "lease-service",
            brokers: ["localhost:9092"],
            logLevel: kafkajs_1.logLevel.ERROR,
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({
            groupId: "lease-service-consumer",
        });
    }
    async connect() {
        await this.consumer.connect();
        await this.producer.connect();
        this.isConnected = true;
        console.log("✅ Kafka connected");
    }
    async leaseInitiated(lease) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_INITIATED",
                        payload: lease,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    // Listen to payment channel webhook
    async leaseConfirmed(lease) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_CONFIRMED",
                        payload: lease,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseCancelled(payload) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_CANCELLED",
                        payload,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseRenewed() {
        // Leaseid, calculate new start date ie currentEnding + 1 year, end.
    }
    async leaseExpiringSoon() { }
}
const kafkaService = new KafkaService();
exports.default = kafkaService;
