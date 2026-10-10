"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const prisma_1 = require("../lib/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
class KafkaService {
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            clientId: "building-service",
            brokers: ["broker:9092"],
            logLevel: kafkajs_1.logLevel.ERROR,
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({
            groupId: "building-service-consumer",
        });
    }
    async connect() {
        await this.producer.connect();
        await this.connectConsumer();
        console.log("✅ Kafka connected");
    }
    async startConsumers() {
        this.consumer.subscribe({
            topics: ["lease.events", "payment.events"],
            fromBeginning: true,
        });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                switch (topic) {
                    case "lease.events":
                        const event = JSON.parse(value || "{}");
                        if (event.type === "LEASE_INITIATED") {
                            this.handleLeaseInitiated(event.payload);
                        }
                        else if (event.type === "LEASE_CONFIRMED") {
                            // Update unit/building to occupied
                            this.handleLeaseConfirmed(event.payload);
                        }
                        else if (event.type === "LEASE_CANCELLED") {
                            // Revert the status of the unit to available
                            this.handleLeaseCancelled(event.payload);
                        }
                        break;
                    case "payment.events":
                        const paymentEvent = JSON.parse(value || "{}");
                        if (paymentEvent.type === "PAYMENT_SUCCESS") {
                            console.log("✅ Payment success");
                            // this.handlePaymentSuccess(paymentEvent.payload as IPaymentSuccessEvent);
                        }
                        else if (paymentEvent.type === "PAYMENT_FAILED") {
                            console.log("❌ Payment failed");
                            // this.handlePaymentFailed(paymentEvent.payload as IPaymentFailedEvent);
                        }
                        break;
                    default:
                        break;
                }
            },
        });
    }
    async connectConsumer() {
        try {
            await this.consumer.connect();
            console.log("✅ Kafka Consumer connected");
        }
        catch (error) {
            console.error("❌ Error connecting to Kafka Consumer:", error);
            throw error;
        }
    }
    async handleLeaseInitiated(lease) {
        const { rentableId, rentableType } = lease;
        switch (rentableType) {
            case "UNIT":
                // First check if unit is available
                await prisma_1.prisma.$transaction(async (tx) => {
                    const unit = await tx.unit.findUnique({
                        where: { id: rentableId, status: "AVAILABLE" },
                    });
                    if (!unit) {
                        throw new appError_1.default("Unit not found or not available", 404);
                    }
                    await tx.unit.update({
                        where: { id: rentableId },
                        data: {
                            status: "RESERVED",
                            reservedAt: new Date(),
                            reservedUntil: new Date(Date.now() + 15 * 60 * 1000),
                        },
                    });
                });
                break;
            case "ROOM":
                await prisma_1.prisma.$transaction(async (tx) => {
                    // First check if room is available
                    const room = await tx.room.findUnique({
                        where: { id: rentableId, status: "AVAILABLE" },
                    });
                    if (!room) {
                        throw new appError_1.default("Room not found or not available", 404);
                    }
                    await tx.room.update({
                        where: { id: rentableId },
                        data: {
                            status: "RESERVED",
                            reservedAt: new Date(),
                            reservedUntil: new Date(Date.now() + 15 * 60 * 1000),
                        },
                    });
                });
                break;
            case "BED":
                await prisma_1.prisma.$transaction(async (tx) => {
                    // Confirm bed is available and not reserved
                    const bed = await tx.bed.findUnique({
                        where: { id: rentableId, status: "AVAILABLE" },
                    });
                    if (!bed) {
                        throw new appError_1.default("Bed not found or not available", 404);
                    }
                    await tx.bed.update({
                        where: { id: rentableId },
                        data: {
                            status: "RESERVED",
                            reservedAt: new Date(),
                            reservedUntil: new Date(Date.now() + 15 * 60 * 1000),
                        },
                    });
                });
                break;
        }
    }
    async handleLeaseConfirmed(lease) {
        const { leaseId, reference, rentableId, rentableType, totalAmount } = lease;
        switch (rentableType) {
            case "UNIT":
                await prisma_1.prisma.unit.update({
                    where: { id: rentableId },
                    data: {
                        status: "OCCUPIED",
                        depositAmount: totalAmount,
                    },
                });
                break;
            case "ROOM":
                await prisma_1.prisma.room.update({
                    where: { id: rentableId },
                    data: {
                        status: "OCCUPIED",
                        depositAmount: totalAmount,
                    },
                });
                break;
            case "BED":
                await prisma_1.prisma.bed.update({
                    where: { id: rentableId },
                    data: {
                        status: "OCCUPIED",
                    },
                });
                break;
        }
    }
    async handleLeaseCancelled(payload) {
        const { rentableType, rentableId } = payload;
        switch (rentableType) {
            case "UNIT":
                await prisma_1.prisma.$transaction(async (tx) => {
                    const unit = await tx.unit.findUnique({
                        where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
                    });
                    if (!unit) {
                        throw new appError_1.default("Unit not found or not reserved", 404);
                    }
                    await tx.unit.update({
                        where: { id: rentableId },
                        data: {
                            status: "AVAILABLE",
                            reservedAt: null,
                            reservedUntil: null,
                            depositAmount: null,
                        },
                    });
                });
                break;
            case "ROOM":
                await prisma_1.prisma.$transaction(async (tx) => {
                    const room = await tx.room.findUnique({
                        where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
                    });
                    if (!room) {
                        throw new appError_1.default("Room not found or not reserved", 404);
                    }
                    await tx.room.update({
                        where: { id: rentableId },
                        data: {
                            status: "AVAILABLE",
                            reservedAt: null,
                            reservedUntil: null,
                            depositAmount: null,
                        },
                    });
                });
                break;
            case "BED":
                await prisma_1.prisma.$transaction(async (tx) => {
                    const bed = await tx.bed.findUnique({
                        where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
                    });
                    if (!bed) {
                        throw new appError_1.default("Bed not found or not reserved", 404);
                    }
                    await tx.bed.update({
                        where: { id: rentableId },
                        data: {
                            status: "AVAILABLE",
                            reservedAt: null,
                            reservedUntil: null,
                            depositAmount: null,
                        },
                    });
                });
                break;
        }
    }
}
const kafkaService = new KafkaService();
exports.default = kafkaService;
