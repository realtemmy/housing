import { z } from "zod";
import { NotificationType, DeliveryChannel } from "../../generated/prisma/client";

export const sendNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM),
  actionUrl: z.string().optional(),
  deliveryChannel: z.nativeEnum(DeliveryChannel).default(DeliveryChannel.IN_APP),
});
