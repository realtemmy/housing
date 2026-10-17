import { Kafka, Producer, Consumer, logLevel } from "kafkajs";
import { RentableType, LeaseStatus, PaymentStatus } from "../generated/prisma/enums";

// Producers:
// lease initiated - Alert Landlord/Owner of building
// Lease confirmed (payment successful and agreement signed) - update unit status to occupied, send receipt and agreement to tenant
// Lease expiring soon (Schedule jobs) - Alert Landlord/Owner of building and tenant
// Rent due notifications - Notify tenant of upcoming rent payment
// Rent payment notifications - Confirm rent payment received
// Late rent notifications - Notify tenant of late rent payment
// Late fee applied - Notify tenant of late fee charged
// Lease activated - Notify when lease becomes active
// Lease renewed - Notify of lease renewal
// Lease expiring soon - Notify of upcoming lease expiration
// Lease terminated - Notify of lease termination

interface ILeaseInitiatedEvent {
  rentableType: RentableType;
  rentableId: string;
}

interface ILeaseConfirmedEvent {
  leaseId: string;
  rentableType: RentableType;
  rentableId: string;
  totalAmount: number;
  reference: string;
}

interface IRentDueEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  amount: number;
  dueDate: string; // ISO date string
}

interface IRentPaidEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  amount: number;
  paymentDate: string; // ISO date string
  reference?: string;
}

interface IRentLateEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  amount: number;
  dueDate: string; // ISO date string
  lateDays: number;
}

interface ILateFeeAppliedEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  lateFeeAmount: number;
  lateFeePercentage: number;
  rentAmount: number;
}

interface ILeaseActivatedEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  activatedDate: string; // ISO date string
}

interface ILeaseRenewedEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  oldEndDate: string; // ISO date string
  newStartDate: string; // ISO date string
  newEndDate: string; // ISO date string
  newRent: number | null;
}

interface ILeaseExpiringSoonEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  endDate: string; // ISO date string
  daysUntilExpiry: number;
}

interface ILeaseTerminatedEvent {
  leaseId: string;
  rentableId: string;
  rentableType: RentableType;
  tenantId: string;
  endDate: string; // ISO date string
  terminationReason: string | null;
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

  async leaseInitiated(event: ILeaseInitiatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_INITIATED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseConfirmed(event: ILeaseConfirmedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_CONFIRMED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseCancelled(payload: {rentableType: RentableType, rentableId: string}): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_CANCELLED",
            payload: {
              ...payload,
              leaseId: "" // leaseId not available in cancelled event, but we can add it if needed
            },
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseRenewed(event: ILeaseRenewedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_RENEWED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseExpiringSoon(event: ILeaseExpiringSoonEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_EXPIRING_SOON",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  // Rent management events
  async rentDue(event: IRentDueEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "RENT_DUE",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async rentPaid(event: IRentPaidEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "RENT_PAID",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async rentLate(event: IRentLateEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "RENT_LATE",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async lateFeeApplied(event: ILateFeeAppliedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LATE_FEE_APPLIED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseActivated(event: ILeaseActivatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_ACTIVATED",
            payload: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  async leaseTerminated(event: ILeaseTerminatedEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic: "lease.events",
      messages: [
        {
          value: JSON.stringify({
            type: "LEASE_TERMINATED",
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
