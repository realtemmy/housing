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
    async leaseInitiated(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_INITIATED",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseConfirmed(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_CONFIRMED",
                        payload: event,
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
                        payload: {
                            ...payload,
                            leaseId: "" // leaseId not available in cancelled event, but we can add it if needed
                        },
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseRenewed(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_RENEWED",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseExpiringSoon(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_EXPIRING_SOON",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    // Rent management events
    async rentDue(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "RENT_DUE",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async rentPaid(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "RENT_PAID",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async rentLate(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "RENT_LATE",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async lateFeeApplied(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LATE_FEE_APPLIED",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseActivated(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_ACTIVATED",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
    async leaseTerminated(event) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic: "lease.events",
            messages: [
                {
                    value: JSON.stringify({
                        type: "LEASE_TERMINATED",
                        payload: event,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
    }
}
const kafkaService = new KafkaService();
exports.default = kafkaService;
