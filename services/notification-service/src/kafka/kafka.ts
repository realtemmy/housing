import { Kafka, Producer, Consumer, logLevel } from "kafkajs";

class KafkaService {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;
  private isConsumerConnected: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: "notifiation-service",
      brokers: [process.env.KAFKA_BROKER || "broker:9092"],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "notification-service-consumer",
    });
    this.producer = this.kafka.producer();
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

  async subscribeToUserCreatedTopic(): Promise<void> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer();
    }
    try {
      await this.consumer.subscribe({
        topic: "auth.user.events",
        fromBeginning: true,
      });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          console.log("📦 Received user created event: ", {
            value,
            topic,
            partition,
          });
        },
      });
    } catch (error) {
      console.error("❌ Error subscribing to user created topic:", error);
      throw error;
    }
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
