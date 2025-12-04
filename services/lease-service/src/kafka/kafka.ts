import { Decimal } from "@prisma/client/runtime/client";
import { Kafka, Producer, Consumer, logLevel } from "kafkajs";

interface ILeaseCreatedEvent {
  leaseId: string;
  unitId: string;
  totalAmount: Decimal;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConsumerConnected: boolean = false;
  constructor() {
    this.kafka = new Kafka({
      clientId: "lease-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9090"],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "lease-service-consumer",
    });
  }

  async leaseCreated(lease: ILeaseCreatedEvent): Promise<void> {}
}


const kafkaService = new KafkaService();
export default kafkaService;