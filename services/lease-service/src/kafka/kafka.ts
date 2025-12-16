import { Decimal } from "@prisma/client/runtime/client";
import { Kafka, Producer, Consumer, logLevel } from "kafkajs";
import { RentableType } from "../generated/prisma/enums";

// Producers:
// lease initiated - Alert Landlord/Owner of building
// Lease confirmed (payment successful and agreement signed) - update unit status to occupied, send receipt and agreement to tenant
// Lease expiring soon (Schedule jobs) - Alert Landlord/Owner of building and tenant

interface ILeaseCreatedEvent {
  leaseId: string;
  rentableType: RentableType;
  rentableId: string;
  totalAmount: Decimal;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected: boolean = false;
  constructor() {
    this.kafka = new Kafka({
      clientId: "lease-service",
      brokers: ["broker:9092"],
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

  async leaseCreated(lease: ILeaseCreatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_CREATED",
            payload: lease,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    })
  }
  async leaseConfirmed(): Promise<void> {
    
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
