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
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
      logLevel: logLevel.ERROR,
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
      this.connect();
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
}


const kafkaService  = new KafkaService();
export default kafkaService;