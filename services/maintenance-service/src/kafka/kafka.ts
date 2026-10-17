import { Kafka, Producer, logLevel } from "kafkajs";

interface IMaintenanceCreatedEvent {
  requestId: string;
  tenantId: string;
  propertyId: string;
  unitId?: string;
  description: string;
  type: string;
  priority: string;
  requestedAt: string;
}

interface IMaintenanceUpdatedEvent {
  requestId: string;
  tenantId: string;
  propertyId: string;
  unitId?: string;
  status: string;
  updatedAt: string;
}

interface IMaintenanceCompletedEvent {
  requestId: string;
  tenantId: string;
  propertyId: string;
  unitId?: string;
  completedAt: string;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;
  
  constructor() {
    this.kafka = new Kafka({
      clientId: "maintenance-service",
      brokers: ["localhost:9092"],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
  }
  
  async connect(): Promise<void> {
    await this.producer.connect();
    this.isConnected = true;
    console.log("✅ Kafka connected (maintenance service)");
  }
  
  async maintenanceCreated(event: IMaintenanceCreatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    await this.producer.send({
      topic: "maintenance.events",
      messages: [
        {
          value: JSON.stringify({
            type: "MAINTENANCE_CREATED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }
  
  async maintenanceUpdated(event: IMaintenanceUpdatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    await this.producer.send({
      topic: "maintenance.events",
      messages: [
        {
          value: JSON.stringify({
            type: "MAINTENANCE_UPDATED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }
  
  async maintenanceCompleted(event: IMaintenanceCompletedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    await this.producer.send({
      topic: "maintenance.events",
      messages: [
        {
          value: JSON.stringify({
            type: "MAINTENANCE_COMPLETED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }
}

const kafkaService = new KafkaService();
export default kafkaService;
