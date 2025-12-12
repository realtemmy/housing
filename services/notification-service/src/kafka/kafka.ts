import {
  Kafka,
  Producer,
  Consumer,
  logLevel,
  EachMessagePayload,
} from "kafkajs";

import Email from "../email/email";

interface IUserCreatedEvent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

class KafkaService {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "notifiation-service",
      brokers: ["localhost:9092"],
      logLevel: logLevel.INFO,
    });
    this.consumer = this.kafka.consumer({
      groupId: "notification-group",
    });
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();
    console.log("✅ Kafka connected");
  }

  async startConsumer(): Promise<void> {
    await this.consumer.subscribe({
      topics: ["auth.user.events"],
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        const value = message.value?.toString();
        switch (topic) {
          case "auth.user.events":
            const event = JSON.parse(value || "{}");
            if(event.type === "USER_CREATED") {
              console.log("📦 Received user created event: ", event.payload);
              await this.handleUserCreated(event.payload as IUserCreatedEvent)
            }
            // await this.handleUserCreated(value);
            break;
          default:
            console.warn(`⚠️ Unhandled topic: ${topic}`);
        }
      },
    });

  }
  private async handleUserCreated(user: IUserCreatedEvent): Promise<void> {
    const email = new Email(user.email);
    await email.sendWelcomeEmail({
      firstName: user.firstName,
      email: user.email,
    });
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
