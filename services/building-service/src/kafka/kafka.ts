import { Kafka, Consumer, Producer, logLevel } from "kafkajs";

// building service listens for lease created and marks unit available for 15 minutes
// building service listens for payment events from the payment service or lease activated and updated unit status

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConsumerConnected: boolean = false;
  constructor() {
    this.kafka = new Kafka({
      clientId: "building-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "building-service-consumer",
    });
  }

  async connectConsumer(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConsumerConnected = true;
      console.log("✅ Kafka Consumer connected");
    } catch (error) {
      console.error("❌ Error connecting to Kafka Consumer:", error);
      throw error;
    }
  }
  // when pay
  async listenForLeaseCreated(): Promise<void> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer();
    }
    try {
      await this.consumer.subscribe({
        fromBeginning: true,
        topic: "lease.created",
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          console.log("📦 Received lease created event: ", {
            value,
            topic,
            partition,
          });
        },
      });
      // Find the unit and mark it as unavailable for 15 minutes if payment is not made
    } catch (error) {
      console.error("❌ Error listening for lease created:", error);
    }
  }

  async listenForPaymentEvents(): Promise<void> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer();
    }
    try {
      await this.consumer.subscribe({
        fromBeginning: true,
        topic: "payment.events",
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          console.log("📦 Received payment event: ", {
            value,
            topic,
            partition,
          });
        },
      });
    } catch (error) {
      console.error("❌ Error listening for payment events:", error);
    }
  }
}
