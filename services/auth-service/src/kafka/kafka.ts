import { Kafka, logLevel, Producer } from "kafkajs";

interface IUserCreatedEvent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface IUserUpdatedEvent {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;
  constructor() {
    this.kafka = new Kafka({
      clientId: "auth-service",
      brokers: ["localhost:9092"],
      logLevel: logLevel.INFO,
    });

    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log("✅ Kafka Producer connected");
    } catch (error) {
      console.error("❌ Error connecting to Kafka:", error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.producer.disconnect();
    }
  }

  async publishUserCreated(user: IUserCreatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    try {
      await this.producer.send({
        topic: "auth.user.events",
        messages: [
          {
            value: JSON.stringify({
              type: "USER_CREATED",
              payload: user,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
      console.log(`📢 Published USER_CREATED for ${user.id}`);
    } catch (error) {
      console.error("❌ Error publishing user-created event:", error);
      throw error;
    }
  }

  async publishUpdatedUser(user: IUserUpdatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      this.producer.send({
        topic: "auth.user.events",

        messages: [
          {
            value: JSON.stringify({
              type: "USER_UPDATED",
              payload: user,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
    } catch (error) {
      console.error("❌ Error publishing updated user event:", error);
      throw error;
    }
  }

  async publishResetPassword(
    email: string,
    firstName: string,
    resetLink: string
  ): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    try {
      this.producer.send({
        topic: "auth.user.events",
        messages: [
          {
            value: JSON.stringify({
              type: "RESET_PASSWORD",
              payload: { email, firstName, resetLink },
            }),
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } catch (error) {
      console.error("❌ Error publishing reset password event:", error);
      throw error;
    }
  }

  async publishPasswordResetSuccess(
    email: string,
    firstName: string
  ): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    try {
      this.producer.send({
        topic: "auth.user.events",
        messages: [
          {
            value: JSON.stringify({
              type: "PASSWORD_RESET_SUCCESS",
              payload: { email, firstName },
            }),
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } catch (error) {
      console.error("❌ Error publishing password reset success event:", error);
      throw error;
    }
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
