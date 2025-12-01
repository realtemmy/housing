import mongoose from "mongoose";

export const NOTIFICATION_TYPES = {
  SYSTEM: "SYSTEM",
  MAINTENANCE: "MAINTENANCE",
  PAYMENT: "PAYMENT",
  LEASE: "LEASE",
  SECURITY: "SECURITY",
  MESSAGE: "MESSAGE",
  OTHER: "OTHER",
};

export const PRIOROTIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxLength: 1000,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      default: NOTIFICATION_TYPES.SYSTEM,
    },
    priority: {
      type: String,
      enum: Object.values(PRIOROTIES),
      default: PRIOROTIES.MEDIUM,
    },
    relatedResource: {
      type: String,
      required: false,
    },
    onModel: {
      type: String,
      required: false,
      enum: [
        "User",
        "Property",
        "Payment",
        "Maintenance",
        "Lease",
        "MaintenanceRequest",
      ],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    actionLink: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

NotificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
