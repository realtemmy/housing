import { Kafka, Consumer, Producer, logLevel } from "kafkajs";

import { prisma } from "../lib/prisma";
import AppError from "../utils/appError";

// building service listens for lease created and marks unit available for 15 minutes
// building service listens for payment events from the payment service or lease activated and updated unit status

// Create event on building created, notification sends message to users eg "New Apartment in Lagos"
// When status of unit/room is updated to maintenance/ not available, prevent leases from being created on the unit

// Allow subscription for new housing in a particular area?

interface ILeaseInitiatedEvent {
  leaseId: string;
  rentableType: "UNIT" | "ROOM" | "BED";
  rentableId: string;
  totalAmount: number;
}

interface ILeaseConfirmedEvent {
  leaseId: string;
  rentableType: "UNIT" | "ROOM" | "BED";
  rentableId: string;
  totalAmount: number;
  reference: string;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  constructor() {
    this.kafka = new Kafka({
      clientId: "building-service",
      brokers: ["broker:9092"],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "building-service-consumer",
    });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.connectConsumer();
    console.log("✅ Kafka connected");
  }

  async startConsumers(): Promise<void> {
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
              this.handleLeaseInitiated(event.payload as ILeaseInitiatedEvent);
            } else if (event.type === "LEASE_CONFIRMED") {
              // Update unit/building to occupied
              this.handleLeaseConfirmed(event.payload as ILeaseConfirmedEvent);
            } else if (event.type === "LEASE_CANCELLED") {
              // Revert the status of the unit to available
              this.handleLeaseCancelled(event.payload as ILeaseInitiatedEvent);
            }
            break;
          case "payment.events":
            const paymentEvent = JSON.parse(value || "{}");
            if (paymentEvent.type === "PAYMENT_SUCCESS") {
              console.log("✅ Payment success");
              // this.handlePaymentSuccess(paymentEvent.payload as IPaymentSuccessEvent);
            } else if (paymentEvent.type === "PAYMENT_FAILED") {
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

  async connectConsumer(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("✅ Kafka Consumer connected");
    } catch (error) {
      console.error("❌ Error connecting to Kafka Consumer:", error);
      throw error;
    }
  }

  private async handleLeaseInitiated(lease: ILeaseInitiatedEvent) {
    const { rentableId, rentableType } = lease;
    switch (rentableType) {
      case "UNIT":
        // First check if unit is available

        await prisma.$transaction(async (tx) => {
          const unit = await tx.unit.findUnique({
            where: { id: rentableId, status: "AVAILABLE" },
          });
          if (!unit) {
            throw new AppError("Unit not found or not available", 404);
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
        await prisma.$transaction(async (tx) => {
          // First check if room is available
          const room = await tx.room.findUnique({
            where: { id: rentableId, status: "AVAILABLE" },
          });
          if (!room) {
            throw new AppError("Room not found or not available", 404);
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
        await prisma.$transaction(async (tx) => {
          // Confirm bed is available and not reserved
          const bed = await tx.bed.findUnique({
            where: { id: rentableId, status: "AVAILABLE" },
          });
          if (!bed) {
            throw new AppError("Bed not found or not available", 404);
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

  private async handleLeaseConfirmed(lease: ILeaseConfirmedEvent) {
    const { leaseId, reference, rentableId, rentableType, totalAmount } = lease;
    switch (rentableType) {
      case "UNIT":
        await prisma.unit.update({
          where: { id: rentableId },
          data: {
            status: "OCCUPIED",
            depositAmount: totalAmount,
          },
        });
        break;

      case "ROOM":
        await prisma.room.update({
          where: { id: rentableId },
          data: {
            status: "OCCUPIED",
            depositAmount: totalAmount,
          },
        });
        break;

      case "BED":
        await prisma.bed.update({
          where: { id: rentableId },
          data: {
            status: "OCCUPIED",
          },
        });
        break;
    }
  }

  private async handleLeaseCancelled(payload: {
    rentableType: "UNIT" | "ROOM" | "BED";
    rentableId: string;
  }) {
    const { rentableType, rentableId } = payload;
    switch (rentableType) {
      case "UNIT":
        await prisma.$transaction(async (tx) => {
          const unit = await tx.unit.findUnique({
            where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
          });

          if (!unit) {
            throw new AppError("Unit not found or not reserved", 404);
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
        await prisma.$transaction(async (tx) => {
          const room = await tx.room.findUnique({
            where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
          });

          if (!room) {
            throw new AppError("Room not found or not reserved", 404);
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
        await prisma.$transaction(async (tx) => {
          const bed = await tx.bed.findUnique({
            where: { id: rentableId, status: { in: ["RESERVED", "OCCUPIED"] } },
          });

          if (!bed) {
            throw new AppError("Bed not found or not reserved", 404);
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
export default kafkaService;
