import { getPrismaClient } from "../../lib/db";
import { NotFoundError, ForbiddenError } from "../../lib/errors";
import { parsePagination, formatPaginated } from "../../lib/pagination";
import { NotificationType, DeliveryChannel, DeliveryStatus } from "../../generated/prisma/client";
import { logger } from "../../lib/logger";

export class NotificationService {
  static async sendNotification(data: {
    recipientId: string;
    title: string;
    message: string;
    type?: NotificationType;
    actionUrl?: string;
    deliveryChannel?: DeliveryChannel;
  }) {
    const prisma = await getPrismaClient();

    const channel = data.deliveryChannel || DeliveryChannel.IN_APP;

    // In-app notification creation
    const notification = await prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.SYSTEM,
        actionUrl: data.actionUrl,
        deliveryChannel: channel,
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });

    // Dev email adapter logging (masking 6-digit OTP/PIN to prevent credential leakage in logs)
    if (channel === DeliveryChannel.EMAIL) {
      const sanitizedMessage = data.message.replace(/\b\d{6}\b/g, "******");
      logger.info(`[EMAIL ADAPTER] Dispatched email to user ${data.recipientId}: "${data.title}" - ${sanitizedMessage}`);
    }

    return notification;
  }

  static async listUserNotifications(userId: string, params: {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const prisma = await getPrismaClient();
    const { page, limit, skip } = parsePagination(params);

    const where: any = { recipientId: userId };
    if (params.unreadOnly) {
      where.isRead = false;
    }

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { recipientId: userId, isRead: false } }),
    ]);

    const paginated = formatPaginated(items, total, page, limit);
    return {
      ...paginated,
      unreadCount,
    };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const prisma = await getPrismaClient();

    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) throw new NotFoundError("Notification", notificationId);

    if (notification.recipientId !== userId) {
      throw new ForbiddenError("Permission denied");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async markAllAsRead(userId: string) {
    const prisma = await getPrismaClient();

    await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: "All notifications marked as read" };
  }
}
