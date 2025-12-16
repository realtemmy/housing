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
      topics: ["auth.user.events", "payment.events"],
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;
        const value = message.value?.toString();
        switch (topic) {
          case "auth.user.events":
            const event = JSON.parse(value || "{}");
            if (event.type === "USER_CREATED") {
              console.log("📦 Received user created event: ", event.payload);
              await this.handleUserCreated(event.payload as IUserCreatedEvent);
            } else if (event.type === "RESET_PASSWORD") {
              await this.handleResetPassword(
                event.payload.email,
                event.payload.firstName,
                event.payload.resetLink
              );
            } else if (event.type === "PASSWORD_RESET_SUCCESS") {
              await this.handlePasswordResetSuccess(
                event.payload.email,
                event.payload.firstName,
                message.timestamp || new Date().toISOString()
              );
            }
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

  private async handleResetPassword(
    email: string,
    firstName: string,
    resetLink: string
  ): Promise<void> {
    const sendMail = new Email(email);
    await sendMail.sendForgotPasswordEmail({
      firstName,
      resetLink,
    });
  }

  private async handlePasswordResetSuccess(
    email: string,
    firstName: string,
    timestamp: string
  ): Promise<void> {
    const sendMail = new Email(email);
    await sendMail.sendResetPasswordSuccessEmail({
      firstName,
      email,
      timestamp,
    });
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
