import { Kafka, Producer, Consumer, logLevel } from "kafkajs";
import { RentableType } from "../generated/prisma/enums";

// Producers:
// lease initiated - Alert Landlord/Owner of building
// Lease confirmed (payment successful and agreement signed) - update unit status to occupied, send receipt and agreement to tenant
// Lease expiring soon (Schedule jobs) - Alert Landlord/Owner of building and tenant

interface ILeaseInitiatedEvent {
  // leaseId: string;
  rentableType: RentableType;
  rentableId: string;
  // totalAmount: number;
}

interface ILeaseConfirmedEvent {
  leaseId: string;
  rentableType: RentableType;
  rentableId: string;
  totalAmount: number;
  reference: string;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected: boolean = false;
  constructor() {
    this.kafka = new Kafka({
      clientId: "lease-service",
      brokers: ["localhost:9092"],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "lease-service-consumer",
    });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();
    this.isConnected = true;
    console.log("✅ Kafka connected");
  }

  async leaseInitiated(lease: ILeaseInitiatedEvent): Promise<void> {
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
  async leaseConfirmed(lease: ILeaseConfirmedEvent): Promise<void> {
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

  async leaseCancelled(payload: {rentableType: RentableType, rentableId: string}){
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
  async leaseExpiringSoon() {}
}

const kafkaService = new KafkaService();
export default kafkaService;
